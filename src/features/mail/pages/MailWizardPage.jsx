import { Outlet } from "react-router-dom";
import { MailWizardProvider } from "@/features/mail/context/MailWizardContext";

const MailWizard = () => {
  return (
    <MailWizardProvider>
      <Outlet />
    </MailWizardProvider>
  );
};

export default MailWizard;
