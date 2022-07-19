import { useState, useEffect } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../App.js";

const Proposals = ({ proposals}) => {

    return (
    <div>
        <table class="table"> 
          <tbody>
            {proposals.map((prop) => {
            return (
              <tr scope="col" key={prop}>
                <td scope="row" >{prop.returnValues.proposalId}</td>
                <td scope="row" >{prop.returnValues.desc}</td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>

    </div>
  )
}

export default Proposals;