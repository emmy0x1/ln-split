import React, { useState } from "react";
import api from "./lib/api";
import userContext from "./context/userContext";

const CreateBill = () => {
  const [descriptionState, setDescriptionState] = useState("");
  const [totalAmountState, setTotalAmountState] = useState(0);

  const blankUser = { name: "", amount: "" };
  const [userState, setUserState] = useState([{ ...blankUser }]);
  const [userIdState, setUserIdState] = useState("");

  const handleBillChange = e => {
    if (e.target.name === "description") {
      setDescriptionState({
        description: e.target.value
      });
    } else {
      setTotalAmountState({
        totalAmount: e.target.value
      });
    }
  };

  const handleUserChange = e => {
    const updatedUsers = [...userState];
    updatedUsers[e.target.dataset.idx][e.target.dataset.type] = e.target.value;
    setUserState(updatedUsers);
  };

  const addUser = () => {
    setUserState([...userState, { ...blankUser }]);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    api.createBill(userIdState, descriptionState, totalAmountState, {
      userAmounts: userState
    });
  };

  return (
    <userContext.Consumer>
      {({user}) => {
        setUserIdState(user.id);

        return (
          <form className="p-64" onSubmit={handleSubmit}>
            <label htmlFor="description">Description</label>
            <input
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block  appearance-none leading-normal"
              type="text"
              name="description"
              id="description"
              onChange={handleBillChange}
            />
            <label htmlFor="totalAmount">Total Amount</label>
            <input
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block  appearance-none leading-normal"
              type="number"
              name="totalAmount"
              id="totalAmount"
              onChange={handleBillChange}
            />
            <input
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="button"
              value="Add User"
              onClick={addUser}
            />

            {userState.map((val, idx) => {
              const userId = `name-${idx}`;
              const amountId = `amount-${idx}`;
              return (
                <div key={`user-${idx}`}>
                  <label htmlFor={userId}>{`User #${idx + 1}`}</label>
                  <input
                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block  appearance-none leading-normal"
                    data-type="name"
                    type="text"
                    name={userId}
                    data-idx={idx}
                    id={userId}
                    value={userState[idx].name}
                    onChange={handleUserChange}
                  />
                  <label htmlFor={amountId}>Amount</label>
                  <input
                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block  appearance-none leading-normal"
                    data-type="amount"
                    type="number"
                    name={amountId}
                    data-idx={idx}
                    id={amountId}
                    value={userState[idx].amount}
                    onChange={handleUserChange}
                  />
                </div>
              );
            })}

            <input
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
              value="Submit"
            />
          </form>
        );
      }}
    </userContext.Consumer>
  );
};

export default CreateBill;
