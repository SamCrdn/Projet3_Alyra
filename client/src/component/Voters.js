import { useState, useEffect } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../App.js";

const Voters = ({ addresses }) => {
    return (
    <div >
        <table class="table"> 
          <tbody>
            {addresses.map((item) => {
            return (
              <tr scope="col" key={item.id}>
                <td scope="row">{item.returnValues.voterAddress}</td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>

    </div>
  )
}

export default Voters;