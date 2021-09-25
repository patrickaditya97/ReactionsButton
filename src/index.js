import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {createGlobalStyle} from 'styled-components'
import axios from "axios";

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
    }

    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`
const usersDataRequest = axios.get("https://artful-iudex.herokuapp.com/users")
const userReactionDataRequest = axios.get("https://artful-iudex.herokuapp.com/user_content_reactions")
const reactionsDataRequest = axios.get("https://artful-iudex.herokuapp.com/reactions")

axios.all([usersDataRequest, reactionsDataRequest, userReactionDataRequest]).then(axios.spread((...responses) => {
    const [usersData, reactionsData, userReactionData] = responses
    ReactDOM.render(
        <React.StrictMode>
            <App 
                usersData={usersData.data}
                reactionsData={reactionsData.data}
                userReactionData={userReactionData.data}
            />
            <GlobalStyle/>
        </React.StrictMode>,
        document.getElementById("root")
    );
}));

