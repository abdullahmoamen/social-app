import React from "react"
import {Link} from "react-router-dom"
function Footer() {
  return (
    <footer className="border-top text-center small text-muted py-3">
      <p>
        <Link to="/"  className="mx-1">
          Home
        </Link>{" "}
        |{" "}
        <Link  to="/about-us" className="mx-1">
          About Us
        </Link>{" "}
        |{" "}
        <Link to="/terms" className="mx-1">
          Terms
        </Link>
      </p>
      <p className="m-0">
        Copyright &copy; 2021{" "}
        <Link to="/" className="text-muted" >
          SocialApp.<i className="fas fa-users"/>
        </Link>
        All rights reserved.
        <a className='awesome' target="_blank" href='https://www.facebook.com/3bdullahmo2men/'>
        Facebook <i className="fab fa-facebook"></i> 
        </a>
        <a className='awesome' target="_blank" href='https://www.linkedin.com/in/abdullah-moamen-b202701b4/'>
        Linkedin <i className="fab fa-linkedin"></i> 
        </a>
      </p>
    </footer>
  )
}

export default Footer
