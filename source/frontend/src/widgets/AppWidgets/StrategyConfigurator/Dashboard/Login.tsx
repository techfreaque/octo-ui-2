import { Button, Input, Radio, Space, Typography } from "antd";
import { t } from "i18next";
import { useState } from "react";
import { Trans } from "react-i18next";

import {
  useAppStoreUserContext,
  useLoginToAppStore,
  useLogoutFromAppStore,
  useSignupToAppStore,
} from "../../../../context/data/AppStoreDataProvider";
import BackendDashboard from "./Backend";

export default function LoginManager() {
  const appStoreUser = useAppStoreUserContext();
  const isLoggedIn = Boolean(appStoreUser?.token);
  return (
    <Space
      direction="vertical"
      style={{
        marginBottom: "20px",
        margin: "auto",
        maxWidth: "500px",
      }}
    >
      {isLoggedIn ? <ManageAccount /> : <LoginSignup />}
    </Space>
  );
}

function ManageAccount() {
  const logoutFromAppStore = useLogoutFromAppStore();
  function handleLogoutFromppStore() {
    logoutFromAppStore();
  }
  return (
    <>
      <Typography.Title>
        <Trans i18nKey="manageAccount.manage-your-octane-account" />
      </Typography.Title>
      <Button onClick={handleLogoutFromppStore}>
        <Trans i18nKey="manageAccount.logout" />
      </Button>
      {/* <AffiliateDashboard /> */}
      <BackendDashboard />
    </>
  );
}

const signUptTypes = {
  signUp: "signUp",
  login: "login",
};

type LoginSignupFieldType = "referral_user_id" | "email" | "password";

const emptyForm = { email: "", password: "", referral_user_id: "" };

export type LoginSignupFormType = {
  [field in LoginSignupFieldType]: string;
};

function LoginSignup() {
  const [logInInfo, setLogInInfo] = useState<LoginSignupFormType>(emptyForm);
  const [formType, setFormType] = useState("signUp");
  function handleCredentialInput(inputName: string, value: string) {
    setLogInInfo((prevInfo) => ({
      ...prevInfo,
      [inputName]: value,
    }));
  }
  const loginToAppStore = useLoginToAppStore();
  function handleLoginToAppStore() {
    if (logInInfo) {
      loginToAppStore(logInInfo, () => setLogInInfo(emptyForm));
    }
  }
  const signupToAppStore = useSignupToAppStore();
  function handleSignupToAppStore() {
    if (logInInfo) {
      signupToAppStore(logInInfo, () => setLogInInfo(emptyForm));
    }
  }
  return (
    <>
      <Typography.Title>
        {formType === signUptTypes.signUp
          ? t("manageAccount.create-an-octane-account-now")
          : t("manageAccount.log-into-octane-now")}
      </Typography.Title>
      <div style={{ margin: "10px 0" }}>
        <Radio.Group
          onChange={(event) => setFormType(event.target.value)}
          defaultValue={signUptTypes.signUp}
        >
          <Radio.Button value={signUptTypes.signUp}>
            <Trans i18nKey="manageAccount.sign-up" />
          </Radio.Button>
          <Radio.Button value={signUptTypes.login}>
            <Trans i18nKey="manageAccount.log-in" />
          </Radio.Button>
        </Radio.Group>
      </div>
      <Input
        name="email"
        value={logInInfo?.email}
        onChange={(event) =>
          handleCredentialInput("email", event?.target?.value)
        }
        placeholder={t("manageAccount.enter-your-email")}
      />
      <div style={{ margin: "10px 0" }}>
        <Input.Password
          value={logInInfo?.password}
          onChange={(event) =>
            handleCredentialInput("password", event?.target?.value)
          }
          placeholder={t("manageAccount.enter-your-password")}
        />
      </div>
      {formType === signUptTypes.signUp && (
        <div style={{ margin: "10px 0" }}>
          <Input
            value={logInInfo?.referral_user_id}
            onChange={(event) =>
              handleCredentialInput("referral_user_id", event?.target?.value)
            }
            placeholder={t(
              "manageAccount.enter-a-referral-code-if-you-have-one",
            )}
          />
        </div>
      )}
      <Space wrap>
        {formType === signUptTypes.signUp ? (
          <Button onClick={handleSignupToAppStore}>
            <Trans i18nKey="manageAccount.create-account-now" />
          </Button>
        ) : (
          <Button onClick={handleLoginToAppStore}>
            <Trans i18nKey="manageAccount.login-now" />
          </Button>
        )}
      </Space>
    </>
  );
}
