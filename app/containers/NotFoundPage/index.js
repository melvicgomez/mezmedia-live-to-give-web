/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';
import styled from 'styled-components';
import { Images } from 'images';
import { Colors } from 'theme/colors';

export default function NotFound() {
  const PageWrapperStyled = styled.div`
    min-height: 100vh;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 350px;
      margin-bottom: 20px;
    }

    a {
      color: ${Colors.white};
      ::hover {
        color: ${Colors.white};
        opacity: 0.7;
        text-decoration: underline;
      }
    }
  `;

  return (
    <PageWrapperStyled>
      <div className="white-text">
        <img src={Images.notfound} alt="not found page" />
        <h2 className="white-text">404 PAGE NOT FOUND</h2>
        <a className="bodyLink white-text" href="/">
          Return to home page
        </a>
      </div>
    </PageWrapperStyled>
  );
}
