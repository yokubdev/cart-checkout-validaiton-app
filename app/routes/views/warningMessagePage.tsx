import { Button, Divider, Text, TextField } from "@shopify/polaris";
import Banner from "app/components/Banner/Banner";
import HeaderBar from "app/components/HeaderBar/HeaderBar";
import Spacer from "app/components/Spacer/Spacer";
import classes from "app/styles/limitation.module.scss";
import { useCallback, useEffect, useState } from "react";
import { useWarningMessages, useSaveWarningMessages } from "app/lib/helper/queries";

interface WarningMessagesProps {
  isSavingMessages: boolean;
  setIsSavingMessages: (isSaving: boolean) => void;
}

const WarningMessages: React.FC<WarningMessagesProps> = ({
  setIsSavingMessages
}) => {
  const [minMessage, setMinMessage] = useState("");
  const [maxMessage, setMaxMessage] = useState("");

  const { data: warningMessages } = useWarningMessages();
  const { mutate: saveMessagesMutation, isPending } = useSaveWarningMessages();

  useEffect(() => {
    if (warningMessages) {
      setMinMessage(warningMessages.min || "");
      setMaxMessage(warningMessages.max || "");
    }
  }, [warningMessages]);

  const handleSaveMessages = useCallback(() => {
    setIsSavingMessages(true);
    saveMessagesMutation(
      { minMessage, maxMessage },
      {
        onSuccess: (data) => {
          setMinMessage(data.min || minMessage);
          setMaxMessage(data.max || maxMessage);
        },
        onSettled: () => {
          setIsSavingMessages(false);
        }
      }
    );
  }, [minMessage, maxMessage, setIsSavingMessages, saveMessagesMutation]);

  const handleMinMessageChange = useCallback((value: string) => {
    setMinMessage(value.slice(0, 80));
  }, []);

  const handleMaxMessageChange = useCallback((value: string) => {
    setMaxMessage(value.slice(0, 80));
  }, []);

  const renderTextField = (
    label: string,
    value: string,
    onChange: (value: string) => void
  ) => (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      autoComplete="off"
      suffix={
        <Text as="span" variant="headingSm">
          {value.length}/80
        </Text>
      }
    />
  );

  const renderBanner = (content: string, placeholder: string, replaceValue: string) => (
    <Banner
      status="critical"
      content={
        content.replace(`{{${replaceValue}}}`, replaceValue === "minimum_quantity" ? "2" : "20") ||
        placeholder
      }
    />
  );

  return (
    <>
      <div className={classes.warning_messages_container}>
        <HeaderBar
          className={classes.warning_messages_header}
          headerTitle="Warning Message"
          headerDescription="Warning message that users will see when they reach the limits"
        />
        <Divider />
        <div className={classes.warning_messages_content}>
          {renderTextField("Minimum quantity limit message", minMessage, handleMinMessageChange)}
          <Spacer size="small" />
          {renderBanner(
            minMessage,
            "Warning message that users will see when they reach the minimum limit",
            "minimum_quantity"
          )}
          <Spacer size="large" />
          {renderTextField("Maximum quantity limit message", maxMessage, handleMaxMessageChange)}
          <Spacer size="small" />
          {renderBanner(
            maxMessage,
            "Warning message that users will see when they reach the maximum limit",
            "maximum_quantity"
          )}
          <Spacer size="large" />
        </div>
      </div>
      <div style={{ marginTop: "20px", float: "right" }}>
        <Button
          variant="primary"
          loading={isPending}
          onClick={handleSaveMessages}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default WarningMessages;