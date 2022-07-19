import { useState, useEffect } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../App.js";

const Navbar = ({ account }) => {
  return (
    <nav className="navbar navbar-dark bg-dark shadow mb-5">
      <p className="navbar-brand my-auto"> Voting Plateforme</p>
      <ul className="navbar-nav">
        <li className="nav-item text-white">{account} </li>
      </ul>
    </nav>
  );
};

export default Navbar;