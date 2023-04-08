import {useTranslation} from "react-i18next";
import {languages} from "../../../containers/App/i18n";

export default function LanguageSwitch() {
    const {i18n} = useTranslation();
    return Object.keys(languages).map((lng) => (
        <button key={lng}
            style={
                {
                    fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal'
                }
            }
            type="submit"
            onClick={
                () => i18n.changeLanguage(lng)
        }>
            {
            languages[lng].nativeName
        } </button>
    ))
}
