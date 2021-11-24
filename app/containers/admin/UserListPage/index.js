/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * UserListPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axiosInstance from 'services';
import styled from 'styled-components';
import { Row, Table, Input } from 'antd';
import Icon, { CloseOutlined } from '@ant-design/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { Colors } from 'theme/colors';
import moment from 'moment';
import { Images } from 'images/index';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUserListPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const List = styled(Table)`
  table,
  tr,
  tbody,
  td,
  thead,
  th {
    color: ${Colors.pureWhite} !important;
    background-color: ${Colors.background} !important;
    border-color: transparent !important;
  }

  tr:not(:nth-child(1)):not(:nth-child(2)) {
    > td {
      border-top: 2px solid ${Colors.bodyText} !important;
    }
  }

  thead,
  th {
    border-bottom: 2px solid ${Colors.bodyText} !important;
  }

  .ant-pagination-item-link,
  .ant-table-pagination.ant-pagination {
    color: ${Colors.pureWhite};
    margin-bottom: 30px;

    input {
      background-color: ${Colors.background} !important;
    }
  }

  .ant-table-sticky-header {
    top: 148px !important;
  }

  .ant-empty-description {
    color: ${Colors.pureWhite};
  }
`;

const SearchBar = styled(Row)`
  width: 100%;
  input {
    background-color: transparent !important;
    border: none;
    color: ${Colors.pureWhite};
  }

  .ant-input-group-addon {
    background-color: transparent !important;
    border: none;
  }

  #users-table-xls-button {
    color: ${Colors.pureWhite};
    background-image: ${props =>
      props.disabled ? Colors.disabled : Colors.blueGradient} !important;
    padding-left: 25px;
    padding-right: 25px;
    border-radius: 16px;
    border: 0px;
    outline: 0px;
    height: 46px;
    display: flex;
    align-items: center;
    box-shadow: ${Colors.shadow} 0px 2px 2px 0px;

    &:hover,
    :focus {
      cursor: pointer;
      background: ${Colors.blueGradient};
      color: ${Colors.pureWhite};
    }

    > .ant-btn-loading-icon {
      margin: 0px 5px 5px 0px;
    }
  }
`;

export function UserListPage({ match }) {
  useInjectReducer({ key: 'userListPage', reducer });
  useInjectSaga({ key: 'userListPage', saga });

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      align: 'center',
      key: 'userId',
      render: text => (
        <a className="white-text" href={`/admin/users/${text}`}>
          {text}
        </a>
      ),
    },
    {
      title: 'First Name',
      dataIndex: 'fname',
      key: 'fname',
    },
    {
      title: 'Last Name',
      dataIndex: 'lname',
      key: 'lname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 130,
      key: 'email',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      width: 105,
      key: 'country',
    },
    {
      title: '#Activities',
      dataIndex: 'activities',
      width: 110,
      align: 'center',
      key: 'activities',
    },
    {
      title: '#Posts',
      dataIndex: 'posts',
      width: 80,
      align: 'center',
      key: 'posts',
    },
    {
      title: '#Comments',
      dataIndex: 'comments',
      width: 120,
      align: 'center',
      key: 'comments',
    },
    {
      title: '#Flags',
      dataIndex: 'flags',
      width: 80,
      align: 'center',
      key: 'flags',
    },
    {
      title: 'B Coins',
      dataIndex: 'bcoin',
      align: 'center',
      key: 'bcoin',
    },
    {
      title: 'Date Joined',
      dataIndex: 'dateJoined',
      width: 110,
      align: 'center',
      key: 'dateJoined',
    },
  ];

  const [userList, setUserList] = useState([]);
  const [usersTable, setUsersTable] = useState([]);
  const [customPagination, setCustomPagination] = useState({
    current: 1,
    pageSize: 200,
    showSizeChanger: false,
    simple: true,
  });
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    getList(1);
    getAllUsersTable();
  }, []);

  const getList = page => {
    axiosInstance
      .get(`api/admin/all-users?page=${page}&search=${keyword.trim()}`)
      .then(res => {
        const details = res.data.data;
        const newList = details.map(d => ({
          key: d.user_id,
          userId: d.user_id,
          fname: d.first_name,
          lname: d.last_name,
          email: d.email,
          country: d.country_code,
          activities:
            d.activity_challenges_count +
            d.activity_meetups_count +
            d.activity_live_sessions_count,
          posts: d.feed_posts_count,
          comments: d.comments_count,
          flags: 0,
          bcoin: d.bcoin_total_sum_amount || 0,
          dateJoined: moment
            .utc(d.created_at)
            .local()
            .format('DD/MM/yyyy'),
        }));
        setUserList(newList);

        setCustomPagination({
          ...customPagination,
          current: page,
          total: res.data.total,
        });
      });
  };

  const getAllUsersTable = () => {
    axiosInstance.get(`api/admin/all-users?per_page=4000}`).then(res => {
      const details = res.data.data;
      setUsersTable(details);
    });
  };

  const handleTableChange = pagination => {
    window.scrollTo(0, 0);
    getList(pagination.current);
  };

  return (
    <div>
      <Helmet>
        <title>Admin Panel - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AdminNavigationWrapperComponent
        match={match}
        topTab={
          <SearchBar align="middle" justify="space-between">
            <div>
              <Input
                className="bodyBold white-text"
                placeholder="Search"
                style={{ width: '150px' }}
                value={keyword}
                addonBefore={
                  <Icon
                    onClick={() => {
                      getList(1);
                    }}
                    component={() => (
                      <img
                        src={Images.searchIcon}
                        style={{ height: '24px', width: '24px' }}
                        alt="search"
                      />
                    )}
                  />
                }
                onPressEnter={() => {
                  getList(1);
                }}
                onChange={e => {
                  setKeyword(e.target.value);
                }}
              />
              {!!keyword && (
                <CloseOutlined
                  style={{
                    fontSize: '20px',
                    marginLeft: '5px',
                    color: Colors.pureWhite,
                  }}
                  onClick={() => {
                    setKeyword('');
                    getList(1);
                  }}
                />
              )}
            </div>

            <div>
              <ReactHTMLTableToExcel
                id="users-table-xls-button"
                className="download-table-xls-button bodyBold white-text"
                table="users-table-to-xls"
                filename="live-to-give-all-users"
                sheet="live-to-give-all-users"
                buttonText="Export to Excel"
              />
            </div>
          </SearchBar>
        }
      >
        <List
          className="bodyBold white-text"
          columns={columns}
          dataSource={userList}
          sticky
          onChange={handleTableChange}
          pagination={customPagination}
          bordered={false}
          // onRow={r => ({
          //   onClick: () => dispatch(push(`users/${r.userId}`)),
          // })}
        />
      </AdminNavigationWrapperComponent>

      <table id="users-table-to-xls">
        <tbody>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Verification Status</th>
            <th>Country</th>
            <th>Photo File Name</th>
            <th>Community Guideines</th>
            <th>Registration Date</th>
          </tr>
          {usersTable
            .filter(user => user.privilege === 'user')
            .sort((a, b) => {
              if (a.first_name < b.first_name) return -1;
              if (a.first_name > b.first_name) return 1;
              return 0;
            })
            .map(user => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.is_verified ? 'Verified' : 'N/A'}</td>
                <td>{user.country_code}</td>
                <td>{user.photo_url || '-'}</td>
                <td>
                  {user.community_guidelines
                    ? moment(user.community_guidelines)
                        .utcOffset('+0800')
                        .format('YYYY-MM-DD HH:mm:ss')
                    : 'N/A'}
                </td>
                <td>
                  {user.created_at
                    ? moment(user.created_at)
                        .utcOffset('+0800')
                        .format('YYYY-MM-DD HH:mm:ss')
                    : 'N/A'}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

UserListPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userListPage: makeSelectUserListPage(),
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
)(UserListPage);
