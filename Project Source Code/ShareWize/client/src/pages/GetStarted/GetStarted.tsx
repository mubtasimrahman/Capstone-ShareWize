import React, { useState } from "react";
import GroupForm from "./components/GroupForm";
import UserForm from "./components/UserForm";
import ExpenseForm from "./components/ExpenseForm";

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
