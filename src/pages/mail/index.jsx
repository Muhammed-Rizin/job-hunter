import { Outlet } from "react-router-dom";
import { MailWizardProvider } from "./MailWizardContext";

const MailWizard = () => {
  return (
    <MailWizardProvider>
      <Outlet />
    </MailWizardProvider>
  );
};

export default MailWizard;
