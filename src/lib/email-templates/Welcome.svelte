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
</script>

<Html lang="en">
  <Head />
  <Preview preview="✨ Sign In into {PUBLIC_PROJECT_NAME}" />
  <Section style={styles.section}>
    <Container style={styles.container}>
      <Text style={styles.text}>
        Welcome {username}!,
      </Text>

      <Text style={styles.text}>
        We are glad to have you onboard in {PUBLIC_PROJECT_NAME}.
      </Text>

      <Hr style={styles.hr} />

      <Text style={styles.footer}>
        See you around,
        <br />
        {PUBLIC_PROJECT_NAME} Team
      </Text>
    </Container>
  </Section>
</Html>
