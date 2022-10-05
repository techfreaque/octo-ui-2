
import { JSONEditor } from "@json-editor/json-editor"


export default function defaultJsonEditorSettings() {
  return {
    theme: "octobot",
    iconlib: "fontawesome5",
    no_additional_properties: true,
    object_layout: "grid",
    disable_properties: true,
    required_by_default: true,
    customThemes: [{ name: 'octobot', theme: OctoBotTheme }],
    editorsArray: ConfirmArray
  }
}

// custom octobot theme
class OctoBotTheme extends JSONEditor.defaults.themes.bootstrap4 {
  getButton(text, icon, title) {
    const el = super.getButton(text, icon, title);
    el.classList.remove("btn-secondary");
    el.classList.add("btn-sm", "btn-primary", "waves-effect");
    return el;
  }
  getCheckbox() {
    const el = this.getFormInputField('checkbox');
    el.classList.add("custom-control-input");
    return el;
  }
  getCheckboxLabel(text) {
    const el = this.getFormInputLabel(text);
    el.classList.add("custom-control-label");
    return el;
  }
  getFormControl(label, input, description) {
    const group = document.createElement("div");

    if (label && input.type === "checkbox") {
      group.classList.add("checkbox", "custom-control", "custom-switch");
      group.appendChild(input);
      group.appendChild(label);
    } else {
      group.classList.add("form-group");
      if (label) {
        label.classList.add("form-control-label");
        group.appendChild(label);
      }
      group.appendChild(input);
    }

    if (description) group.appendChild(description);

    return group;
  }
}


// custom delete confirm prompt
class ConfirmArray extends JSONEditor.defaults.editors.array {
  askConfirmation() {
    if (this.jsoneditor.options.prompt_before_delete === true) {
      if (window.confirm("Remove this element ?") === false) {
        return false;
      }
    }
    return true;
  }
}

