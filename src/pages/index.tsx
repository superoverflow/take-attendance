import Head from "next/head";
import {
  Avatar,
  Container,
  Button,
  Modal,
  Flex,
  Text,
  TextInput,
  UnstyledButton,
  Stack,
  Notification,
  Space,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useMutation } from "react-query";
import people from "./people.json";
import { useState } from "react";

type SheetForm = {
  name: string;
};

const SubmitSuccessAlert = () => {
  return <Notification color="teal">Thank you!</Notification>;
};
const SubmitErrorAlert = () => {
  return (
    <Notification color="red" title="Aw, snap!">
      Something went wrong!
    </Notification>
  );
};

const handleSubmit = async (values: SheetForm) => {
  const rawResponse = await fetch("/api/submit", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const content = await rawResponse.json();
  console.log({ content });
};

export default function Home() {
  const [searchWord, setSearchWord] = useState<string>();
  const [selectedPerson, setSelectedPerson] = useState<string>();
  const [opened, { open, close }] = useDisclosure(false);

  const submitForm = useMutation({
    mutationFn: (values: SheetForm) => handleSubmit(values),
    onSuccess: close,
  });

  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  return (
    <>
      <LoadingOverlay visible={submitForm.isLoading} overlayBlur={2} />
      <Head>
        <title>London 2023-05-19</title>
        <link rel="icon" href="/ust.png" />
      </Head>

      <Container size="xs" px="xs" mt="md">
        <TextInput
          placeholder="Please type your name here to search ..."
          onChange={(e) => setSearchWord(e.target.value)}
        />
        <Flex
          gap="xl"
          mt="md"
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
          {people
            .filter((p) =>
              searchWord ? p.name.toLowerCase().includes(searchWord) : true
            )
            .map((person) => (
              <Container
                key={person.name}
                onClick={() => {
                  setSelectedPerson(person.name);
                  form.setFieldValue("name", person.name);
                  open();
                }}
              >
                <UnstyledButton key={person.name}>
                  <Avatar size="xl" src={person.picture} />
                  <Text
                    c="cyan.8"
                    sx={{ fontFamily: "Greycliff CF, sans-serif" }}
                    fw={700}
                    size="md"
                    ta="center"
                  >
                    {person.name}
                  </Text>
                </UnstyledButton>
              </Container>
            ))}
        </Flex>
      </Container>
      <Modal
        opened={opened}
        onClose={close}
        title="London 2023-05-19 Ust Alumni Meetup "
        centered
      >
        <form onSubmit={form.onSubmit((values) => submitForm.mutate(values))}>
          <Stack>
            <Text ta="center">
              Thanks for joining, {selectedPerson}! Please check in to confirm
              your attendance!
            </Text>
            <TextInput label="name" {...form.getInputProps("name")} disabled />
            <Flex mx="auto" gap="md">
              <Button type="submit">Check in</Button>
              <Button color="red" onClick={close}>
                Cancel
              </Button>
            </Flex>
          </Stack>
        </form>
      </Modal>
      {submitForm.isSuccess ? (
        <SubmitSuccessAlert />
      ) : submitForm.isError ? (
        <SubmitErrorAlert />
      ) : (
        <Space h={60} />
      )}
    </>
  );
}
