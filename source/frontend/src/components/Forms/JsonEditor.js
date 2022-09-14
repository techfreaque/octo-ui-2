import {Button} from "@mui/material";
import {useEffect, useState} from "react";

export default function JsonEditor({editorId, data, schema, editor, setEditor, tentacleName}) {
    const HtmlEditorId = "json-editor-" + editorId;
    function createEditor(editor, schema, data) {
      editor instanceof window.JSONEditor && editor.destroy();
      const editorElement = document.getElementById(HtmlEditorId)
      setEditor(tentacleName, new window.JSONEditor(editorElement, {
            schema: schema,
            startval: data,
            no_additional_properties: true,
            prompt_before_delete: true,
            disable_array_reorder: true,
            disable_collapse: false,
            disable_properties: true
        }));
    }


    useEffect(() => {
        schema && createEditor(editor, schema, data);

    }, [editorId, data, schema]);

    return (
        <>
            <div id={HtmlEditorId}></div>
        </>
    )
}
