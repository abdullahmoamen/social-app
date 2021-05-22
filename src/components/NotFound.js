import React from 'react';
import Page from './Pages';
import {Link} from 'react-router-dom';
function NotFound() {
    return (
        <Page title="not found">
        <div className="text-center">
            <h1>Wh😶😶ps there is an EROOR 4🤨4 !</h1>
            <p className="lead text-muted">&laquo;Back to <Link to="/">Home Page</Link></p>
        </div>
    </Page>
    )
}

export default NotFound;
