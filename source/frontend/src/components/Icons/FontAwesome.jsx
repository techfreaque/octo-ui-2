export default function FontAwesomeIconByString({faIcon, size="3x"}) {
    return faIcon && (
        <i className={
                `fa-2xl fas fa-${faIcon}`
            }
            size={size}
            style={
                {marginRight: "5px"}
            }/>
    )
}
