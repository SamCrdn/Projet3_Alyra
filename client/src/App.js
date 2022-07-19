import { useState, useEffect } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import NavBar from "./component/NavBar";
import Voters from "./component/Voters";
import Proposals from "./component/Proposals";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';


function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [addresses, setAdresses] = useState([]);
  const [addr, setAddr] = useState("");
  const [proposals, setProposals] = useState([]);
  const [description, setDescription] = useState([]);
  const [voteId, setVoteId] = useState();
  const [vote, setVote] = useState();
  const [owned, setOwned] = useState(false);
  const [status, setStatus] = useState([]);
  const [winner, setWinner] = useState();


  useEffect(() => {
      setUpWeb3();
    },[]);

  const setUpWeb3 = async () => { 
      //Set up Web3
    try {
        const web3Provider = await getWeb3();
        const accounts = await web3Provider.eth.getAccounts();
        const networkId = await web3Provider.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];
        const instance = new web3Provider.eth.Contract(
          VotingContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        let options = {
          fromBlock: 0,
          toBlock: 'latest'
        };

        let options1 = {
          fromBlock: 0,
        };

        // recupération des events
        let listAddress = await instance.getPastEvents('VoterRegistered', options);
        let listProposals = await instance.getPastEvents('ProposalRegistered', options);
        //let workFlowStatus = await instance.getPastEvents('WorkflowStatusChange', options);
        let Vote = await instance.getPastEvents('Voted', options);
        
        instance.events.VoterRegistered(options1).on('voterAddress', event => listAddress.push(event));
        instance.events.ProposalRegistered(options1).on( 'proposalId', event => listProposals.push(event));
        //instance.events.WorkflowStatusChange(options1).on( 'newStatus', event => workFlowStatus.push(event));
        instance.events.Voted(options1).on( 'proposalId', event => Vote.push(event));

        // variable pour l'affichage conditionel
        const owner = await instance.methods.owner().call();

        // Sets des variables
        setOwned(accounts[0]==owner);
        setWeb3(web3Provider); 
        setAccounts(accounts);
        setContract(instance);
        setAdresses(listAddress);
        setProposals(listProposals);
        //setStatus(workFlowStatus); Fait crasher :( je comprends pas pourquoi)
        setVote(Vote);
        
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      };
    }
   

    //Fonctions des boutons
    const handleAddVoter = async () => {
      await contract.methods.addVoter(addr).send({ from: accounts[0] });
      setAddr("");
    }

    const handleAddProposal = async () => {
      const receipt = await contract.methods.addProposal(description).send({ from: accounts[0] });
      setDescription("");
      const workFlowStatus = await contract.methods.getCurrentStatus().call();
      setStatus(workFlowStatus);
    }

    const handleStartProposalsRegistering = async () => {
      const receipt = await contract.methods.startProposalsRegistering().send({ from: accounts[0] });  

    }

    const handleEndProposalsRegistering = async () => {
      const receipt = await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
    }

    const handleStartVotingSession = async () => {
      const receipt = await contract.methods.startVotingSession().send({ from: accounts[0] }); 
    }

    const handleEndVotingSession = async () => {
      const receipt = await contract.methods.endVotingSession().send({ from: accounts[0] });
    }

    const handleVote = async () => {
      const receipt = await contract.methods.setVote(parseInt(voteId)).send({ from: accounts[0] }); 
       setVoteId("") ;
      
    }
    const handleTallyVotes = async () => {
      const winningID = await contract.methods.winningProposalID().call();  
      setWinner(winningID);
    }

if(owned) {
      return (
        <div className="App">
          <NavBar account={accounts}/> 
          
          <p>Status: {status}</p>
          <button className="status" type="button" class="btn btn-outline-primary" onClick={handleStartProposalsRegistering}>startProposalsRegistering</button>
          <button className="status" type="button" class="btn btn-outline-primary" onClick={handleEndProposalsRegistering}>endProposalsRegistration</button>
          <button className="status" type="button" class="btn btn-outline-primary" onClick={handleStartVotingSession}>startVotingSession</button>
          <button className="status" type="button" class="btn btn-outline-primary" onClick={handleEndVotingSession}>endVotingSession</button>
          <button className="status" type="button" class="btn btn-outline-primary" onClick={handleTallyVotes}>tallyVotes</button>

          <div className="voters">
          <input className="input" type="text" value={addr} onChange={(evt) => {setAddr(evt.currentTarget.value)}} />
          <button className="btn" type="button" class="btn btn-outline-primary" onClick={handleAddVoter}>Add Voter</button>         
          <Voters addresses={addresses} />
          </div>
          
          <div className="voters">
          <Proposals proposals={proposals}/>
          </div>

          <div className="voters">
          <button className="btn" type="button" class="btn btn-outline-primary" onClick={handleTallyVotes}>Result</button>
          <p>Winner Proposal : {winner}</p>
          </div>

        </div>
      );
   } else {
    return (
      <div className="App">
        <NavBar account={accounts}/> 
        
        <p>Status: {status}</p>
      
        <div className="voters">
        <input className="input" type="text" value={description} onChange={(evt) => {setDescription(evt.currentTarget.value)}} />
        <button className="btn" type="button" class="btn btn-outline-primary" onClick={handleAddProposal}>Add Proposals</button>
        <Proposals proposals={proposals}/>
        </div>

        <div className="voters">
        <input className="input" type="text" value={voteId} onChange={(evt) => {setVoteId(evt.currentTarget.value)}} />
        <button className="btn" type="button" class="btn btn-outline-primary" onClick={handleVote}>I vote</button>
        <p>I voted : {vote}</p>
        </div>

        <div className="voters">
        <button className="btn" type="button" class="btn btn-outline-primary" onClick={handleTallyVotes}>Result</button>
        <p>Winner Proposal : {winner}</p>
        </div>

      </div>
    );
   }
}

export default App;