import React from 'react';
import { Typography, Container, Paper } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Terms and Conditions
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to [Your Company]! By accessing this website, you agree to comply with and be bound by the following terms and conditions.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Use of Cookies
        </Typography>
        <Typography variant="body1" paragraph>
          We employ the use of cookies. By accessing [Your Company], you agree to use cookies in accordance with our Privacy Policy.
        </Typography>

        <Typography variant="h6" gutterBottom>
          License
        </Typography>
        <Typography variant="body1" paragraph>
          Unless otherwise stated, [Your Company] owns the intellectual property rights for all material on this site. You may access this
          for personal use subject to the restrictions in these terms and conditions.
        </Typography>

        <Typography variant="body1" paragraph>
          You must not:
        </Typography>
        <ul>
          <li>Republish material from [Your Company]</li>
          <li>Sell, rent, or sub-license material from [Your Company]</li>
          <li>Reproduce, duplicate, or copy material from [Your Company]</li>
          <li>Redistribute content from [Your Company]</li>
        </ul>

        <Typography variant="h6" gutterBottom>
          Hyperlinking to Our Content
        </Typography>
        <Typography variant="body1" paragraph>
          Certain organizations may link to our website without prior written approval, including government agencies, search engines, and
          news organizations.
        </Typography>

        <Typography variant="body1" paragraph>
          We may consider and approve other link requests from commonly known business information sources, community sites, and
          associations.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsAndConditions;
