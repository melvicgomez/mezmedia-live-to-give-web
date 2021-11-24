/* eslint-disable react/no-unescaped-entities */
/**
 *
 * PrivacyPolicyPage
 *
 */

import React, { memo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import AppBarComponent from 'components/AppBarComponent';
import { compose } from 'redux';
import { isMobile } from 'react-device-detect';
import { Row } from 'antd';
import { Colors } from 'theme/colors';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectPrivacyPolicyPage from './selectors';
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
  }
`;

const NumberedList = styled.ol`
  counter-reset: list;

  > li {
    list-style: none;
  }

  > li:before {
    content: '(' counter(list) ') ';
    counter-increment: list;
    margin-right: 20px;
  }
`;

export function PrivacyPolicyPage() {
  useInjectReducer({ key: 'privacyPolicyPage', reducer });
  useInjectSaga({ key: 'privacyPolicyPage', saga });

  return (
    <div>
      <Helmet>
        <title>Privacy Policy - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AppBarComponent />
      <PageWrapperStyled className="white-text">
        <div>
          <Row justify="start" className="h1" style={{ margin: '20px 0px' }}>
            Live to Give Privacy and Cookies Policy
          </Row>
          <Divider />
          <Content>
            <div className="body">
              <p className="bodyBold">
                This is the Privacy Policy for the Live to Give online platform
                (“Live To Give”), developed by Just Challenge Ltd, with its
                registered office at Unit 32-122, Signature, 31 & 32F Hysan
                Place, 500 Hennessy Road, Causeway Bay, Hong Kong (in this
                document referred to as “Platform Provider”, “we” or “us”) for
                Barclays Bank Plc APAC Employees (in this document referred to
                as “users”, “Barclays employees” or “you”).
              </p>
              <p>
                This Privacy Policy <strong>(“Policy”)</strong> sets out:
              </p>
              <NumberedList>
                <li>
                  The information collected about you when you visit and use
                  Live to Give and/or otherwise interact with us;
                </li>
                <li>How data is collected;</li>
                <li>How data is used, shared, stored, and secured; and</li>
                <li>How you may access and control the information.</li>
              </NumberedList>
              <p>
                Live to Give is an online platform, designed to engage, connect,
                motivate and incentivise Barclay’s Employees across the APAC
                region. Live to Give is accessible by mobile app and desktop web
                browser.
              </p>
              <p>
                This Policy explains what data is collected about you through
                Live to Give and how it is stored, analysed and shared. This
                Policy applies to all personal information whether collected
                online or offline. This Policy also explains your rights with
                regards to your data, and how to contact us to request access,
                corrections, transfer, restriction or deletion of the data
                collected about you.
              </p>
              <p>
                If you do not agree with our policies and practices contained in
                this Policy, please do not register or engage with Live to Give.
                Interaction with any content or activity through Live to Give
                will be deemed as your agreement and binding acceptance of the
                terms and conditions of this Policy
              </p>
              <p>
                In this Policy, <strong>“Personal Information”</strong> refers
                to any personal data, information, or combination of data and
                information that is provided by you to us, or through your use
                of our products or services, that relates to an identifiable
                individual.
              </p>
              <p className="h3">
                1&nbsp;&nbsp;What information Live to Give collects about you
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    1.1
                  </div>
                  <div>
                    The following information will be collected about you
                    through Live to Give:
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    Profile information that you provide when you register for
                    an account or sign up for our products or services, for
                    example your name, username or similar identifier, other
                    personal description, date of birth, age and gender, email
                    address, address and phone number (collectively, “Account
                    Data”). “Account Data” is also used by the Platform Provider
                    to create your user account, verify your identity or to get
                    in touch with you about your account if needed
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    Activity data uploaded to the platform shared via the users
                    personal linked Fitness App account{' '}
                    <strong>(“Activity Data”)</strong>.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '100px', marginBottom: '10px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>•</div>
                  <div>This includes, but is not limited to:</div>
                </Row>
              </p>
              <p style={{ marginLeft: '130px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>•</div>
                  <div>
                    activity (including date, time and geo-location information
                    as well as your speed and pace and perceived exertion);{' '}
                  </div>
                </Row>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>•</div>
                  <div>
                    photos, posts, comments and contributions, kudos, ratings,
                    survey results, reviews;
                  </div>
                </Row>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>•</div>
                  <div>equipment usage.</div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    Content you provide through use of Live to Give or
                    associated third party social channels, for example “blog
                    posts, comments, discussion forums, chats, reviews, photos,
                    images” (collectively, <strong>“User Content”</strong>).
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    Communication, marketing, and other preferences that you set
                    when you set up your account or profile, or when you
                    participate in a survey or a questionnaire (collectively,
                    <strong> “Preference Data”</strong>). The Platform Provider
                    maintains records of any communications, via email or our
                    support desks, to help resolve your customer service
                    enquiries.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    Information about your activity and interaction with Live To
                    Give <strong>(“Usage Data”)</strong>, such as your device
                    type, browser type and IP address. This information is used
                    to help assess the performance of Live to Give, or assist
                    you with support requests. This will be periodically
                    accessed for experience optimisation.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    Information about your device or connection, for example
                    “your internet protocol (IP) address, location information,
                    log-in data, browser type and version, time-zone setting,
                    browser plug-in types and versions, operating system and
                    platform, and other technology on the devices you use to
                    access our products or services” and information collected
                    through cookies and other data collection technologies
                    (collectively, <strong>“Technical Data”</strong>).
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '35px' }}>
                    1.2
                  </div>
                  <div>
                    Sensitive data or special category data is not collected.
                    This includes details about your race, ethnic origin,
                    politics, religion, trade union membership, genetics or
                    sexual orientation
                  </div>
                </Row>
              </p>
              <p className="h3">
                2&nbsp;&nbsp;How your personal information and data is used and
                shared
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    2.1
                  </div>
                  <div>
                    Personal information is used, disclosed and/or shared as
                    below:
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    To carry on business and operate Live to Give, to improve
                    our products and services, to provide customer support and
                    personalised features, administer your account membership,
                    and to protect the safety and security of Live to Give;
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    With our and the Platform Provider’s other entities, trusted
                    third parties and service providers including (without
                    limitation) print service providers, call centres and mail
                    houses, advisors, advertising agencies, accountants,
                    auditors and lawyers for data processing, analysis, back-up
                    and storage, information broking, research, investigation,
                    website application development and technology services,
                    infrastructure, customer support, business analytics, and
                    other related services;
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    To satisfy a legitimate interest which is not overridden by
                    your fundamental rights or data protection interests, for
                    example for research and development, and in order to
                    protect legal rights and interests;
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    To publish your information as part of testimonials, social
                    posts, or customer stories to promote the Platform
                    Provider’s products or services, only where you have given
                    consent to do so for this specific purpose;
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    When legally required to do so by so by governments,
                    tribunals, law enforcement and regulatory agencies (for
                    example as part of an ongoing investigation, subpoena,
                    similar legal process or proceeding) and/or to comply with a
                    legal or regulatory obligation;
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    If Live to Give or Platform Provider is acquired by a third
                    party as a result of a merger, acquisition, or business
                    transfer, your personal information may be disclosed and/or
                    transferred to a third party in connection with such
                    transaction; or
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px' }}>-</div>
                  <div>
                    Use your personal information to create{' '}
                    <strong>“Anonymous Data” </strong>
                    records by removing any information (including any contact
                    information) that would allow the remaining data to be
                    linked back to you. Anonymous Data maybe used for internal
                    purposes, such as analysing patterns and programme usage to
                    improve our services. Additionally, we may use Anonymous
                    Data to analyze and understand demographic trends, customer
                    behaviour patterns and preferences, and information that can
                    help enrich the content and quality of Live to Give.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    2.2
                  </div>
                  <div>
                    If you have given consent to use your personal information
                    for a specific purpose, you have the right to withdraw your
                    consent any time by contacting us, but please note this will
                    not affect any use of your information that has already
                    taken place.
                  </div>
                </Row>
              </p>
              <p className="h3">
                3&nbsp;&nbsp;Third party software, links or websites
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    3.1
                  </div>
                  <div>
                    If you use any third-party software in connection with our
                    products or services, for example any third-party software
                    that Live to Give integrates with, you might give the
                    third-party software provider access to your account and
                    information. Policies and procedures of third-party software
                    providers are not controlled by us or the Platform Provider,
                    and this Policy does not cover how your information is
                    collected or used by third-party software providers. You are
                    encouraged to review the privacy policies of third-party
                    software providers before you use the third-party software.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    3.2
                  </div>
                  <div>
                    Live to Give may contain links to third-party websites over
                    which the Platform Provider has no control. If you follow a
                    link to any of these websites or submit information to them,
                    your information will be governed by their policies. We do
                    not endorse any third-party sites or their content and we
                    have no control over the conduct of the companies or
                    organisations operating those sites. You are encouraged to
                    review the privacy policies of third-party websites before
                    you submit information to them.
                  </div>
                </Row>
              </p>
              <p className="h3">
                4&nbsp;&nbsp;How information is stored and protected
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    4.1
                  </div>
                  <div>
                    Live to Give and the Platform Provider are responsible for
                    hosting and securing data and takes every step to protect
                    your information and do this in the following ways:
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '15px' }}>
                    a)
                  </div>
                  <div>
                    encrypting your password at login stage on Live to Give;
                  </div>
                </Row>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '15px' }}>
                    b)
                  </div>
                  <div>
                    retaining your information only for as long as needed to
                    provide the services across Live to Give;
                  </div>
                </Row>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '15px' }}>
                    c)
                  </div>
                  <div>
                    location information that you submit through our services
                    will be stored in Singapore, but may be transferred to third
                    parties outside of this location;
                  </div>
                </Row>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '15px' }}>
                    d)
                  </div>
                  <div>
                    modification information that you have stored on Live To
                    Give can be modified or deleted by visiting Live to Give.
                  </div>
                </Row>
              </p>
              <p className="h3">5&nbsp;&nbsp;Your rights</p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    5.1
                  </div>
                  <div>You have the right to:</div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '35px' }}>
                    5.1.1
                  </div>
                  <div>
                    be informed of what is being done with your personal
                    information;
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '35px' }}>
                    5.1.2
                  </div>
                  <div>
                    request a copy of the readily retrievable personal
                    information held about you by us;
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '35px' }}>
                    5.1.3
                  </div>
                  <div>
                    request amendment or correction to any inaccuracy,
                    incompleteness or error in any readily retrievable personal
                    information held about you by us (you may be required to
                    produce supporting documents to verify the accuracy of the
                    new personal information which you provide). If we think the
                    correction is reasonable and we are reasonably able to
                    change the personal information, we will make the
                    correction. If we do not make the correction, we will take
                    reasonable steps to note on the personal information that
                    you requested the correction;
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '35px' }}>
                    5.1.4
                  </div>
                  <div>
                    request erasure of your personal information by us (note,
                    this may not always be able to be fulfilled if we are
                    required to retain the information for record keeping
                    purposes, to complete transactions, or to comply with our
                    legal obligations);
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '35px' }}>
                    5.1.5
                  </div>
                  <div>
                    object to or restrict the processing of your personal
                    information by us (including for marketing purposes);
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '60px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '35px' }}>
                    5.1.6
                  </div>
                  <div>
                    withdraw your consent at any time where consent is required
                    to process your personal information held by us (although
                    this will not affect the lawfulness of any processing
                    carried out before you withdraw your consent).
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    5.2
                  </div>
                  <div>
                    If you withdraw your consent, you may not be able to access
                    Live to Give. You will be advised if this is the case at the
                    time you withdraw your consent.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    5.3
                  </div>
                  <div>
                    You may opt out of receiving marketing materials from any of
                    our partners by contacting the Platform Provider (see clause
                    7 below). Please note, however, that even if you opt out
                    from receiving marketing materials, you will continue to
                    receive notifications or information that is necessary for
                    the use of our products or services and Live to Give.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    5.4
                  </div>
                  <div>
                    As a security measure, specific information may be required
                    from you to help confirm your identity when processing your
                    privacy requests or when you exercise your rights.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    5.5
                  </div>
                  <div>
                    Any request under clause 7 will normally be addressed free
                    of charge. However, a reasonable administration fee may be
                    charged if we deem your request at our sole discretion
                    unfounded, repetitive, or excessive.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    5.6
                  </div>
                  <div>
                    We will endeavour to respond to all legitimate requests
                    within one month. It may take longer than a month if your
                    request is particularly complex or if you have made a number
                    of requests.
                  </div>
                </Row>
              </p>
              <p className="h3">6&nbsp;&nbsp;Contact us</p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    6.1
                  </div>
                  <div>
                    Please contact the Platform Provider in the first instance
                    if you have any questions or concerns. If you have
                    unresolved concerns, you may have the right to file a
                    complaint with a data protection authority in the country
                    where you live or work or where you feel your rights have
                    been infringed.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    6.1
                  </div>
                  <div>
                    Please contact{' '}
                    <span className="bodyLink cyan-text">
                      katherine@just-challenge.com
                    </span>{' '}
                    or submit any written request to:
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }} />
                  <div>
                    <div>Just Challenge</div>
                    <div>Unit 32-122, Signature, 31 & 32F Hysan Place,</div>
                    <div>500 Hennessy Road, Causeway Bay, Hong Kong,</div>
                    <div>Attn: Katherine Parker</div>
                  </div>
                </Row>
              </p>
              <p className="h3">7&nbsp;&nbsp;Cookies</p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    7.1
                  </div>
                  <div>
                    Live to Give uses <strong>“Cookies”</strong> (small sets of
                    information stored as text), and <strong>“Pixels”</strong>{' '}
                    (images used to identify web visitors), to provide a more
                    personalised experience on Live to Give and third party
                    services, to improve our products and services, and to
                    measure and analyse usage of Live to Give.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    7.2
                  </div>
                  <div>
                    Cookies help store your account information when you’ve
                    logged in to Live to Give, and helps personalise your
                    experience.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    7.3
                  </div>
                  <div>
                    Analytics and tracking Cookies and Pixels help track how
                    Live to Give is being used, analyse its performance, and
                    provide this analysis to websites where your interactions
                    have been with that website.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    7.4
                  </div>
                  <div>
                    Cookies and Pixels are also used by Live to Give and third
                    party advertisers to serve ads based on a user's prior
                    visits to a website. These advertising Pixels or Cookies
                    enables us, the Platform Provider, third parties, and our
                    partners to serve ads to you based on your visit to our
                    website and/or other websites on the Internet. We may
                    implement our own third party advertising Cookies and Pixels
                    to the same ends.
                  </div>
                </Row>
              </p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    7.5
                  </div>
                  <div>
                    Most web browsers will allow you to set some controls over
                    Cookies in your brower settings, including disabling Cookies
                    on your browser. You can disable Pixels by disabling
                    Javascript on your browser. Disabling or refusing Cookies or
                    Pixels may significantly inhibit the performance of Live To
                    Give or some features of Live to Give may become
                    inacessible.
                  </div>
                </Row>
              </p>
              <p className="h3">8&nbsp;&nbsp;Changes to this Policy</p>
              <p style={{ marginLeft: '20px' }}>
                <Row wrap={false}>
                  <div style={{ marginRight: '10px', minWidth: '25px' }}>
                    8.1
                  </div>
                  <div>
                    This Policy may be amended from time to time by posting the
                    updated policy on <strong>Live to Give</strong>. It is your
                    responsibility to refer to our Policy from time to time to
                    familiarise yourself with any changes. By continuing to use
                    <strong> Live to Give</strong> after the changes come into
                    effect, you agree to be bound by the revised policy.
                  </div>
                </Row>
              </p>
            </div>
          </Content>
        </div>
      </PageWrapperStyled>
    </div>
  );
}

PrivacyPolicyPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  privacyPolicyPage: makeSelectPrivacyPolicyPage(),
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
)(PrivacyPolicyPage);
