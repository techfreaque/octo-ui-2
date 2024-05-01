import { BranchesOutlined } from "@ant-design/icons";
import AppIconButton from "../../../../../components/Buttons/AppIconButton";

export default function ConfigureApp({ app, onConfigure }) {
  return (
    app.is_selected && (
      <AppIconButton
        isSelected={app.is_selected}
        buttonTitle={`Configure ${app.categories[0]}`}
        antIconComponent={BranchesOutlined}
        onClick={onConfigure}
      />
    )
  );
}
