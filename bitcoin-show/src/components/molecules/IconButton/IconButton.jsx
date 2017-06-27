import React from 'react'
import Icon from '../../atoms/Icon/Icon.jsx'

const IconButton = (props) => {
    return (
        <a>
            <Icon className={props.className} icon={props.icon} />
        </a>
    );
}

export default IconButton;
