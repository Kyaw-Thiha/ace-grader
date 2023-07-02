import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  studentName: string;
  title: string;
  url: string;
}

export const CheckingFinishedEmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ studentName, title, url }) => (
  <Html>
    <Head />
    <Preview>View your answer sheet with this link</Preview>
    <Tailwind>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your answer sheet has been checked</Heading>
          <Text className="my-4">
            Dear {studentName}, your answer sheet for the {title} has been
            checked.
          </Text>
          <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-primary disabled:pointer-events-none disabled:opacity-50">
            <Link
              href={url}
              target="_blank"
              style={{
                ...link,
                display: "block",
                marginBottom: "16px",
              }}
            >
              Click here to view answer sheet
            </Link>
          </Button>

          <Text style={{ ...text, marginBottom: "14px" }}>
            Or, copy and paste this url:
          </Text>
          <code style={code}>{url}</code>
          <Text
            style={{
              ...text,
              color: "#ababab",
              marginTop: "14px",
              marginBottom: "16px",
            }}
          >
            If you didn&apos;t answer this worksheet at AceGrader, you can
            safely ignore this email.
          </Text>
          <Img
            src={"/favion-32x32.png"}
            width="32"
            height="32"
            alt="AceGrader's Logo"
          />
          <Text style={footer}>
            <Link
              href="https://www.acegrader.com"
              target="_blank"
              style={{ ...link, color: "#898989" }}
            >
              AceGrader
            </Link>
            , the AI-powered grading platform
            <br />
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};
