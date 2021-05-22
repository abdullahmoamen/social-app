import React, { useEffect } from "react"
import Container from "./Container"

function Pages(props) {
useEffect(() => {
    document.title = `${props.title} | SocialApp`
    window.scrollTo(0, 0)
}, [props.title])

return <Container wide={props.wide}>{props.children}</Container>
}

export default Pages
