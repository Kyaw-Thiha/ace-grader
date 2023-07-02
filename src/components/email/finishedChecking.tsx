import * as React from "react";

interface EmailTemplateProps {
  studentName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  studentName,
}) => (
  <div>
    <h1>Welcome, {studentName}!</h1>
  </div>
);
