/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * UserCommentListComponent
 *
 */

import React, { useEffect, useState, useRef } from 'react';
// import PropTypes from 'prop-types';
import axiosInstance from 'services';
import styled from 'styled-components';
import { Row, Table, Input } from 'antd';
import Icon, { CloseOutlined } from '@ant-design/icons';
import { Colors } from 'theme/colors';
import moment from 'moment';
import { Images } from 'images/index';

const List = styled(Table)`
  .ant-table-bordered .ant-table-header > table,
  .ant-table-bordered .ant-table-body > table,
  .ant-table-bordered .ant-table-fixed-left table,
  .ant-table-bordered .ant-table-fixed-right table {
    border-left: none;
  }

  .ant-table-bordered {
    .ant-table-thead > tr > th:last-child {
      border-right: none;
    }
    .ant-table-tbody > tr > td:last-child {
      border-right: none;
    }
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }

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
  position: relative;
  margin-right: 40px;

  input {
    background-color: transparent !important;
    border: none;
    color: ${Colors.pureWhite};
  }

  .ant-input-group-addon {
    background-color: transparent !important;
    border: none;
  }
`;

const ClearIcon = styled(CloseOutlined)`
  position: absolute;
  right: -25px;
  font-size: 20px;
  margin-left: 5px;
  color: ${Colors.pureWhite};
`;

const FilterBar = styled(Row)`
  margin-left: 30px;

  > div {
    margin-right: 50px;
    cursor: pointer;
  }
`;

function UserCommentListComponent({ match }) {
  const columns = [
    {
      title: 'Feed ID',
      dataIndex: 'feedId',
      align: 'center',
      key: 'feedId',
      render: text => (
        <a className="white-text" href={`/admin/comments/${text[1]}`}>
          {text[0]}
        </a>
      ),
    },
    {
      title: 'Posted Date',
      dataIndex: 'postedDate',
      key: 'postedDate',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      width: 200,
    },
    {
      title: 'Flagged',
      dataIndex: 'flagged',
      key: 'flagged',
    },
    {
      title: 'Deleted',
      dataIndex: 'deleted',
      key: 'deleted',
    },
  ];

  const [commentList, setCommentList] = useState([]);
  const [customPagination, setCustomPagination] = useState({
    current: 1,
    pageSize: 200,
    showSizeChanger: false,
    simple: true,
  });
  const [keyword, setKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(1);

  // for clean up unmount
  const unmounted = useRef(false);

  useEffect(() => {
    getList(1);

    return () => {
      unmounted.current = true;
    };
  }, []);

  const getList = (page, search = '', filter = 1) => {
    axiosInstance
      .get(
        `api/admin/users-get-comments?page=${page}&user_id=${
          match.params.id
        }&search=${
          !!search && keyword.trim().length ? search : ''
        }&show_status=${
          filter === 1 ? 'all' : filter === 2 ? 'flagged' : 'deleted'
        }`,
      )
      .then(res => {
        if (!unmounted.current) {
          setSelectedFilter(filter);
          const details = res.data.data;
          const newList = details.map(d => ({
            key: d.comment_id,
            feedId: [d.feed_id, d.comment_id],
            postedDate: moment
              .utc(d.created_at)
              .local()
              .format('DD/MM/yyyy HH:mm'),
            comment: d.comment,
            flagged: d.recent_flag
              ? moment
                  .utc(d.recent_flag.created_at)
                  .local()
                  .format('DD/MM/yyyy HH:mm')
              : '-',
            deleted: d.deleted_at
              ? moment
                  .utc(d.deleted_at)
                  .local()
                  .format('DD/MM/yyyy HH:mm')
              : '-',
          }));
          setCommentList(newList);

          setCustomPagination({
            ...customPagination,
            current: page,
            total: res.data.total,
          });
        }
      });
  };

  const handleTableChange = pagination => {
    window.scrollTo(0, 0);
    getList(pagination.current);
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <Row wrap={false} style={{ marginBottom: '5px' }}>
        <SearchBar align="middle">
          <Input
            className="bodyBold white-text"
            placeholder="Search"
            style={{ width: '150px' }}
            value={keyword}
            addonBefore={
              <Icon
                onClick={() => {
                  getList(1, keyword);
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
              getList(1, keyword);
            }}
            onChange={e => {
              setKeyword(e.target.value);
            }}
          />
          {!!keyword && (
            <ClearIcon
              onClick={() => {
                setKeyword('');
                getList(1, '');
              }}
            />
          )}
        </SearchBar>
        <FilterBar className="bodyBold">
          <div
            className={selectedFilter === 1 ? 'cyan-text' : 'white-text'}
            onClick={() => getList(1, keyword, 1)}
          >
            Show All
          </div>
          <div
            className={selectedFilter === 2 ? 'cyan-text' : 'white-text'}
            onClick={() => getList(1, keyword, 2)}
          >
            Show Flagged
          </div>
          <div
            className={selectedFilter === 3 ? 'cyan-text' : 'white-text'}
            onClick={() => getList(1, keyword, 3)}
          >
            Show Deleted
          </div>
        </FilterBar>
      </Row>

      <List
        className="bodyBold white-text"
        columns={columns}
        dataSource={commentList}
        sticky
        onChange={handleTableChange}
        pagination={customPagination}
        bordered={false}
      />
    </div>
  );
}

UserCommentListComponent.propTypes = {};

export default UserCommentListComponent;
