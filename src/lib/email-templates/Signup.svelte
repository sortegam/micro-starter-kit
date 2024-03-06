<script>
  import {
    Hr,
    Html,
    Text,
    Container,
    Head,
    Section,
    Preview,
  } from 'svelte-email';
  import * as styles from './styles';
  import { PUBLIC_PROJECT_NAME } from '$env/static/public';

  export let username = 'User';
  export let code = 'Code';
</script>

<Html lang="en">
  <Head />
  <Preview preview="Sign up to {PUBLIC_PROJECT_NAME}" />
  <Section style={styles.section}>
    <Container style={styles.container}>
      <Text style={styles.text}>
        Welcome {username}!
      </Text>

      <Text style={styles.text}>
        Here is the code you need to sign up into your {PUBLIC_PROJECT_NAME}
        account.
      </Text>

      <Text style={styles.verificationCode}>{code}</Text>

      <Text style={styles.text}>
        Didn't try to sign up to {PUBLIC_PROJECT_NAME}
        account? You can safely disregard this message.
      </Text>

      <Hr style={styles.hr} />

      <Text style={styles.footer}>
        Thank you,
        <br />
        {PUBLIC_PROJECT_NAME} Team
        <br />
      </Text>
    </Container>
  </Section>
</Html>
