/* eslint-disable react/no-unescaped-entities */
/**
 *
 * TermsAndConditionsPage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { isMobile } from 'react-device-detect';
import { Row, Table } from 'antd';
import { Colors } from 'theme/colors';
import AppBarComponent from 'components/AppBarComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectTermsAndConditionsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PageWrapperStyled = styled.div`
  background-color: ${Colors.background};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: ${() => (isMobile ? 'auto' : '1366px')};
  min-height: calc(100vh-68px);
  display: flex;
  padding-top: 68px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: auto;

  > div {
    width: ${() => (isMobile ? '90%' : '70%')};
    padding: 20px 0px;
  }
`;

const Divider = styled.div`
  height: 2px;
  background-color: ${Colors.pureWhite};
  width: 100%;
  margin: 20px 0px;
`;

const Content = styled.div`
  > div {
    p,
    ol,
    ul {
      margin-bottom: 20px;
    }

    ul {
      list-style: none;
      width: 100%;

      > li:before {
        display: inline-block;
        content: '-';
        width: 1em;
        margin-left: -1em;
      }
    }

    ol {
      li {
        margin-bottom: 10px;
      }
    }

    table,
    tr,
    tbody,
    td {
      color: ${Colors.pureWhite};
      background-color: ${Colors.background} !important;
    }

    thead,
    th {
      background-color: ${Colors.darkGrey} !important;
      color: ${Colors.pureWhite};
    }
  }
`;

export function TermsAndConditionsPage() {
  useInjectReducer({ key: 'termsAndConditionsPage', reducer });
  useInjectSaga({ key: 'termsAndConditionsPage', saga });

  const columns = [
    {
      title: 'Term',
      dataIndex: 'term',
      width: '25%',
      key: 'term',
    },
    {
      title: 'Definition',
      dataIndex: 'definition',
      key: 'definition',
    },
  ];

  const data = [
    {
      key: '1',
      term: 'Live to Give',
      definition:
        'The name of the online platform, in either mobile app or desktop web browser format.',
    },
    {
      key: '2',
      term: 'User(s)',
      definition: 'Barclays employees who have signed up to Live to Give.',
    },
    {
      key: '3',
      term: 'User Content',
      definition:
        'Any information, data, text, software, sound, photographs, graphics, video, messages, posts, tags, or other materials you make available on the Live to Give platform.',
    },
    {
      key: '4',
      term: 'Third Party Content',
      definition:
        'Any information, data, text, software, sound, photographs, graphics, video, messages, posts, tags, or other materials, from a third party, made available on the Live to Give platform by Just Challenge.',
    },
    {
      key: '5',
      term: 'Challenge(s) and Live Session(s)',
      definition:
        'Events and competitions available through Live to Give for Users to take part in.',
    },
    {
      key: '6',
      term: 'Trackable Challenge(s)',
      definition:
        'Fitness challenge that requires integration with a Fitness App to monitor activity in order to take part in the challenge.',
    },
    {
      key: '7',
      term: 'Fitness App',
      definition:
        'Fitness Apps (such as Strava, FitBit, Apple Healthkit, Google Fit) that will link via API to Live to Give to allow tracking of physical activity',
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Terms and Conditions - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AppBarComponent />
      <PageWrapperStyled className="white-text">
        <div>
          <Row justify="start" className="h1" style={{ margin: '20px 0px' }}>
            Live to Give Terms and Conditions
          </Row>
          <Divider />
          <Content>
            <div className="body">
              <p className="bodyBold">
                These are the Terms and Conditions of access to the Live to Give
                online platform (“Live To Give”), developed by Just Challenge
                Ltd, with its registered office at Unit 32-122, Signature, 31 &
                32F Hysan Place, 500 Hennessy Road, Causeway Bay, Hong Kong (in
                this document referred to as “Just Challenge”, “we” or “us”) for
                Asia Pacific Employees of Barclays Bank PLC and its affiliates
                (in this document referred to as “users”, “Barclays employees”
                or “you”).
              </p>
              <p>
                Your use of Live to Give and any interaction with any content or
                activity through Live to Give will be subject to these Terms and
                Conditions and by using Live to Give you agree to be bound by
                them.
              </p>
              <p>
                You acknowledge and accept that Barclays Bank PLC or any of its
                affiliates (“Barclays”) is not responsible nor liable for any
                aspect of your engagement or consumption of content or
                activities through Live to Give. Your use of Live to Give is
                wholly voluntary and at your own risk and responsibility, and
                does not fall within the scope of your employment with Barclays,
                and you acknowledge that any injury, illness, death, loss,
                damage or expense, cost or other claim of any description
                suffered by you in connection with your use of Live to Give and
                activities undertaken on the platform does not arise out of
                and/or in the course of your employment with Barclays. Barclays
                shall have the right and benefit to enforce this provision.
                Barclays is not associated with any of the Third Party Content
                providers and does not endorse the views, content, activities,
                product or services offered on the B Well platform
              </p>
              <p>
                Just Challenge may need to update these Terms and Conditions
                from time to time to accurately reflect our offerings and
                practices. Subject to prior notice, Just Challenge reserve the
                right to change these Terms and Conditions by changing them on
                the Live to Give platform. Your continued access to Live to Give
                , subsequent to any updates, shall be deemed as your agreement
                and binding acceptance of the updated Terms and Conditions
              </p>
              <p>
                Just Challenge may restrict or block your access to and use of
                the Live to Give platform at any time if Just Challenge
                reasonably believes that you may have breached these Terms and
                Conditions and all rights granted to you under these Terms and
                Conditions will terminate immediately in the event that you are
                in breach hereof.
              </p>
              <p>
                These Terms and Conditions were last updated on [12 January
                2021].
              </p>
              <p className="h3">Live to Give Overview</p>
              <p>
                Live to Give is an online platform, designed, developed and
                delivered to engage, connect, motivate and incentivize Barclays
                employees across the APAC region. The Live to Give is accessible
                by mobile app and desktop web browser.
              </p>
              <p className="h3">Definitions</p>
              <Table
                columns={columns}
                dataSource={data}
                bordered
                pagination={false}
              />
              <p style={{ marginTop: '20px' }} className="h3">
                Platform Access
              </p>
              <p>
                It is your responsibility to ensure your equipment (computer,
                laptop, notebook, tablet or other mobile device) meets all the
                necessary technical specifications to enable you to access and
                use Live to Give.
              </p>
              <p>
                To use Live to Give, you must register. Access to Live to Give
                is for Barclays APAC employees only. Registration to the
                platform will require a valid Barclays email address (i.e.
                john.doe@Barclays.com). Only those registered to use the
                platform can access, engage and consume any content, live
                sessions or challenges through the Live to Give platform.
              </p>
              <p>
                It is your responsibility to ensure your equipment (computer,
                laptop, notebook, tablet or other mobile device) meets all the
                necessary technical specifications to enable you to access and
                use Live to Give.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of the
                password associated with your account to ensure no one but you
                logs into your account and uses the platform. You accept
                responsibility for all activities that occur under your account
                through either the desktop web browser or the mobile app.
              </p>
              <p>
                Just Challenge will use appropriate technical, organisational
                and security measures to provide protection against unauthorized
                access to your account. Just Challenge cannot, however,
                guarantee absolute security of your account, your User Content
                or the personal information you provide. To the extent permitted
                by law, Just Challenge does not accept any liability in respect
                of third-party “hackers” illegally accessing your account or the
                Live to Give platform and any content or information sitting
                within it unless such liability arose from our failure to comply
                with applicable Data Protection legislation. You agree to
                immediately notify Just Challenge of any unauthorized use of
                your account or password, or any other breach of security
                immediately in the instance it occurs.
              </p>
              <p>
                We cannot guarantee the continuous, uninterrupted or error-free
                operability of Live to Give, there may be times when certain
                features, content and/or parts of Live to Give become
                temporarily or permanently unavailable (scheduled or
                unscheduled) or are modified, suspended or withdrawn by us, in
                our sole discretion, without notice. You agree that Just
                Challenge are not liable to you or any third party for any loss
                or damage (including direct, indirect loss, or special or
                consequential loss) arising from any unavailability,
                disruptions, defects, technical errors, suspension or withdrawal
                of content on any parts of Live to Give that may occur at any
                time and from time to time.
              </p>
              <p className="h3">Platform Usage</p>
              <p>
                You represent and warrant that: (i) you are authorised to create
                your account; (ii) you own the User Content posted by you on or
                through Live to Give or otherwise have the right to grant the
                rights and licenses; (iii) the posting and use of your User
                Content on or through Live to Give does not and will not
                violate, misappropriate or infringe on the rights of any third
                party, including, without limitation, privacy and data
                protection rights, publicity rights, copyrights, trademark
                and/or other intellectual property rights; and (iv) you agree to
                pay for all royalties, fees, and any other monies owed by reason
                of User Content you post on or through Live to Give.
              </p>
              <p>
                Just Challenge accepts no liability for any User Content, Third
                Party Content, Challenges or Live Sessions on the Live to Give
                platform, or any loss or damage of any kind incurred as a result
                of these, unless the loss or damage resulted from our gross
                negligence, wilful misconduct, or breach of applicable laws. You
                agree to bear all risks associated with your use of any User
                Content, Third Party Content, Challenges or Live Sessions
                available in connection with the Live to Give platform,
                including any reliance on the accuracy, completeness, or
                usefulness of these. Just Challenge is not liable in any way for
                the content provided by any third party, nor their actions
              </p>
              <p>
                You accept that you are entirely responsible for all User
                Content that you upload, post, transmit or otherwise make
                available through Live to Give. Just Challenge does not
                guarantee the accuracy, integrity or quality of any User Content
                on the Live to Give platform. Just Challenge may, in its sole
                discretion, screen, monitor, hide, refuse or remove any User
                Content that is considered objectionable.
              </p>
              <p>
                Just Challenge will use appropriate technical, organisational
                and security measures to provide protection against unauthorized
                access to your account. Just Challenge cannot, however,
                guarantee absolute security of your account, your User Content
                or the personal information you provide. To the extent permitted
                by law, Just Challenge does not accept any liability in respect
                of third-party “hackers” illegally accessing your account or the
                Live to Give platform and any content or information sitting
                within it unless such liability arose from our failure to comply
                with applicable Data Protection legislation. You agree to
                immediately notify Just Challenge of any unauthorized use of
                your account or password, or any other breach of security
                immediately in the instance it occurs.
              </p>
              <p>
                You may only use Live to Give for non-commercial and lawful
                (complying with all applicable laws and regulations) use in
                accordance with these Terms and Conditions. You agree to not
                modify, copy, distribute, transmit, display, perform, reproduce,
                publish, license, create derivative works from, transfer or sell
                for any commercial purposes, anything available through Live To
                Give. You agree that you will not, nor will you assist or
                encourage any other party to, engage in any of the following
                prohibited activities:
              </p>
              <ol>
                <li>Copy, frame or mirror any part of Live to Give;</li>
                <li>
                  Permit any unauthorised third party to access Live to Give;
                </li>
                <li>
                  Use, copy, modify, create a derivative work of, reverse
                  engineer, decompile or otherwise attempt to extract the source
                  code of the software underlying Live to Give or any part
                  thereof, unless expressly permitted or required by law, and in
                  any case, without providing prior written notice to Just
                  Challenge;
                </li>
                <li>
                  Publish, transmit, distribute or store content, material,
                  information or data that: (1) is illegal, obscene, defamatory,
                  threatening, harassing, abusive, or hateful or that advocates
                  violence; (2) is harmful to or interferes with Live to Give or
                  any third party’s networks, equipment, applications, services
                  or websites (e.g., viruses, worms, Trojan horses, etc.); (3)
                  infringes, dilutes, misappropriates or otherwise violates any
                  privacy, intellectual property, publicity or other personal
                  rights including, without limitation, copyrights, patents,
                  trademarks, trade secrets or other proprietary information
                  (including unauthorized use of domain names); or (4) is
                  fraudulent or contains false, deceptive or misleading
                  statements, claims or representations (such as “phishing”);
                </li>
                <li>
                  Attempt to disrupt, degrade, impair or violate the integrity
                  or security of Live to Give or the computers, services,
                  Accounts or networks of any other party (including, without
                  limitation, “hacking,” “denial of service” attacks, etc.),
                  including any activity that typically precedes attempts to
                  breach security such as scanning, probing or other testing or
                  vulnerability assessment activity, or engaging in or
                  permitting any network or hosting activity that results in the
                  blacklisting or other blockage of Live to Give internet
                  protocol space;
                </li>
                <li>
                  Distribute, or disclose any part of Live to Give in any
                  medium, including without limitation by any automated or
                  non-automated “scraping”;
                </li>
                <li>
                  Take any action that imposes, or may impose, at our sole
                  discretion, an unreasonable or disproportionately large load
                  on our infrastructure;
                </li>
                <li>
                  Collect or harvest any information relating to an identified
                  or identifiable individual, including account names and
                  information about users of Live to Give , from Live to Give;
                </li>
                <li>
                  Submit to the Live to Give or Just Challenge any information
                  that may be protected from disclosure by applicable law;
                </li>
                <li>
                  Bypass the measures we may use to prevent or restrict access
                  to Live to Give, including, without limitation, features that
                  prevent or restrict use or copying of any content or enforce
                  limitations on use of Live to Give or the content therein;
                </li>
                <li>
                  Violate any applicable law, statute, ordinance or regulation,
                  or encourage any conduct that could constitute a criminal
                  offense or give rise to civil liability;
                </li>
                <li>
                  Remove any copyright, trademark or other proprietary rights
                  notices contained in or on Live to Give; or
                </li>
                <li>
                  Execute any form of network monitoring or running a network
                  analyser or packet sniffer or other technology to intercept,
                  decode, mine or display any packets used to communicate
                  between Live to Give ’s servers or any data not intended for
                  you.
                </li>
              </ol>
              <p>
                In order to take part in a Trackable Challenge, you will need to
                integrate a Fitness App (such as Strava, FitBit, Apple
                Healthkit, Google Fit) with the Live to Give platform. It is
                your responsibility to ensure your equipment (computer, laptop,
                notebook, tablet or other mobile device and any health tracking
                device) enable integration between Live to Give and your chosen
                Fitness App. You acknowledge that in order to use certain
                features of Live to Give you may be required to purchase third
                party equipment or materials (e.g., Garmin Watch). Just
                Challenge accepts no responsibility for your acquisition or use
                of any third party equipment or materials and does not guarantee
                that these third party equipment or materials will function with
                Live to Give or will be error-free.
              </p>
              <p>
                We cannot guarantee that Live to Give is free of viruses and/or
                other code that may have contaminating or destructive elements
                but we are utilizing and will continue to utilize the most
                recent version and the most recent data file of a reputable,
                commercially available anti-virus-checking software program to
                ensure that the Live to Give platform and our services are free
                of viruses or destructive elements. It is your responsibility to
                implement appropriate IT security (including anti-virus and
                other security checks) to safeguard your system and equipment.
              </p>
              <p>
                Live to Give may include links to external sites. We include
                these in order to provide you with access to required /
                additional information, products or services that you may find
                useful or interesting. We are not responsible for the content on
                these external sites or anything provided by them; additionally
                we do not guarantee that they will be continuously available.
                The fact that we include links to such external sites also does
                not imply our endorsement of our association with their
                operators or promoters. Please read all copyright and legal
                notices on each linked website before downloading or printing
                items to ensure that you are permitted to do so under the third
                party site's copyright notices, legal notices or terms of use.
                You maintain full responsibility for your dealings with third
                parties and your use of third party websites, applications,
                products or services.
              </p>
              <p className="h3">Termination</p>
              <p>
                You agree that access to and use of Live to Give is not
                guaranteed and Just Challenge may, if required under certain
                circumstances and without prior notice, immediately suspend or
                terminate your account and/or access to Live to Give. Cause for
                such suspension or termination shall include, but not be limited
                to:
              </p>
              <ol>
                <li>
                  Breaching or violating these Terms and Conditions or any other
                  incorporated agreements, policies or guidelines that have been
                  made known to you;
                </li>
                <li>
                  Requests by law enforcement or other government agencies;
                </li>
                <li>As requested by you - self-initiated account deletion;</li>
                <li>
                  Discontinuance or material modification to Live to Give;
                </li>
                <li>
                  Unexpected technical, maintenance, operations or security
                  issues or problems
                </li>
              </ol>
              <p>
                Furthermore, you agree that any suspension or termination of
                your account shall be made solely by Just Challenge and that
                Just Challenge are not liable to you or any third party for any
                suspension or termination of your account or access to Live To
                Give.
              </p>
              <p className="h3">Privacy</p>
              <p>
                Use of any personal information submitted to or via Live to Give
                is governed by our Privacy Policy (please refer to the Just
                Challenge Privacy Policy). By using or downloading Live to Give,
                you confirm that you agree to these Terms and Conditions and to
                our Privacy Policy. If you do not agree, do not use Live To
                Give. You are responsible for ensuring the security of the
                personal information held on your computer, mobile or other
                device
              </p>
              <p className="h3">Indemnity</p>
              <p>
                You shall indemnify and hold harmless Just Challenge and all its
                entities, employees, consultants, agents, representatives,
                partners and licensors against all third party Claims (defined
                herein below) howsoever arising which may be asserted against or
                suffered by us and which relate to your use of Live to Give and
                activities undertaken on the platform and/or the breach in the
                security of your computer, mobile or other device or the access
                to any information held on your computer, mobile or other device
                by unauthorised third parties.
              </p>
              <p>
                For the purpose of the above paragraph, “Claims” shall mean all
                demands, claim and liability (whether criminal or civil, in
                contact, tort or otherwise) for losses, damages, legal costs and
                other expenses of any nature whatsoever and all costs and
                expenses (including without limitation legal costs) incurred in
                connection therewith.
              </p>
              <p>
                To the extent permitted by law, you agree that we will not be
                liable to you in contract, tort, negligence, breach of statutory
                duty or otherwise for any loss, damage, costs, or expenses of
                any nature whatsoever incurred or suffered by you of an indirect
                or consequential nature, including without limitation any
                economic loss or other loss of turnover, profit, business or
                goodwill.
              </p>
              <p>
                To the extent permitted by law, and in circumstances where we
                have not effectively excluded liability to you under or in
                connection with these terms and conditions, you agree that the
                maximum limit of our liability to you whether in contract, tort,
                negligence, breach of statutory duty or otherwise shall not
                exceed HKD 2,000.
              </p>
              <p className="h3">Invalidity</p>
              <p>
                If a provision of these Terms and Conditions is or becomes
                illegal, invalid or unenforceable in any jurisdiction, that does
                not affect:
              </p>
              <ul>
                <li>
                  The legality, validity or enforceability in that jurisdiction
                  of any other provision of these Terms and Conditions; or
                </li>
                <li>
                  The legality, validity or enforceability in other
                  jurisdictions of that or any other provision of these Terms
                  and Conditions.
                </li>
              </ul>
              <p className="h3">Governing Law and Jurisdiction</p>
              <p>
                These terms and conditions and any disputes or claims or other
                matters arising out of or in connection with Live to Give and
                these Terms and Conditions shall be governed by and construed in
                accordance with the laws of Hong Kong without regard to any
                principles governing conflicts of laws that would result in the
                application of the law of a different jurisdiction. You further
                irrevocably agree that the courts of Hong Kong shall have
                exclusive jurisdiction to hear and settle any dispute or claim
                that arises out of or in connection with these terms and
                conditions and Live to Give.
              </p>
            </div>
          </Content>
        </div>
      </PageWrapperStyled>
    </div>
  );
}

TermsAndConditionsPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  termsAndConditionsPage: makeSelectTermsAndConditionsPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(TermsAndConditionsPage);
