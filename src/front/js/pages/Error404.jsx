import React from "react";
import { Link } from "react-router-dom";
import error404 from "../../img/error-404.png";

export const Error404 = () => {
    return (
        <div className="text-center mt-3" id="background">
            <h1 className="text-black fw-bold">404 - You’ve Reached the End of the Internet!</h1>
            <p>
                <img className="img-fluid" src={error404} alt="404 Error" />
            </p>
            <p className="text-black fw-bold fst-italic">
                Well, maybe not the <em>end</em>, but the page you’re looking for isn’t here.<br/>
                Why not head back to the homepage and try again?
            </p>
            <div className="d-flex justify-content-center">
                <Link className="text-center" to="/">
                    <button type="button" className="btn btn-dark">Go Back Home</button>
                </Link>
            </div>
        </div>
    );
};
