import { JSONSchema6 } from "json-schema";
import Form, { UiSchema } from "react-jsonschema-form";

export default function ReactJsonEditor({
  schema,
  formData,
  onChange,
  onSubmit,
}: {
  schema: JSONSchema6;
  formData: any;
  onChange: (formData: any) => void;
  onSubmit: (formData: any) => void;
}) {
  const uiSchema: UiSchema = {};
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      showErrorList={true}
      noValidate={false}
      noHtml5Validate={false}
      formData={formData}
      onChange={onChange}
      onSubmit={() => onSubmit(formData)}
    />
  );
}
