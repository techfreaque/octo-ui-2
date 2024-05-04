export default function defaultJsonEditorSettings(): {
  iconlib: "fontawesome5";
  no_additional_properties: boolean;
  object_layout: "grid";
  disable_properties: boolean;
  disable_edit_json: boolean;
  required_by_default: boolean;
} {
  return {
    iconlib: "fontawesome5",
    no_additional_properties: true,
    object_layout: "grid",
    disable_properties: true,
    disable_edit_json: true,
    required_by_default: true,
  };
}
