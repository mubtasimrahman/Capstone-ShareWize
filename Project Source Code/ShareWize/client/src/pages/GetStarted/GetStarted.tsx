import React, { useState } from "react";
import GroupForm from "./components/GroupForm/GroupForm";
import UserForm from "./components/UserFrom/UserForm";
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
import "./GetStarted.css";

function GetStarted() {
  const [groupId, setGroupId] = useState<number | null>(null);

  return (
    <div className="container-fluid">
      <GroupForm setGroupId={setGroupId} />
      {groupId && (
        <>
          <UserForm groupId={groupId} />
          <ExpenseForm groupId={groupId} />
        </>
      )}
    </div>
  );
}

export default GetStarted;
