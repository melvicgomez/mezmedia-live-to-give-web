/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * CommentListPage
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
// import { push } from 'connected-react-router';
import { connect } from 'react-redux';
// import axiosInstance from 'services';
import moment from 'moment';
import axiosInstance from 'services';
import styled from 'styled-components';
import { Table, Row, Input } from 'antd';
import Icon, { CloseOutlined } from '@ant-design/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCommentListPage from './selectors';
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

  .fix-line {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 22px;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
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
  margin-left: 40px;

  > div {
    margin-right: 50px;
    cursor: pointer;
  }
`;

export function CommentListPage({ match }) {
  useInjectReducer({ key: 'commentListPage', reducer });
  useInjectSaga({ key: 'commentListPage', saga });

  const [commentList, setCommentList] = useState([]);
  const [customPagination, setCustomPagination] = useState({
    current: 1,
    pageSize: 200,
    showSizeChanger: false,
    simple: true,
  });
  const [selectedSorter, setSelectedSorter] = useState({
    columnKey: 'feed_id',
    order: 'descend',
  });
  const [keyword, setKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(1);

  // for clean up unmount
  const unmounted = useRef(false);

  const columns = [
    {
      title: 'Feed ID',
      dataIndex: 'feedId',
      align: 'center',
      key: 'feedId',
      render: text => (
        <a className="white-text" href={`comments/${text[1]}`}>
          {text[0]}
        </a>
      ),
    },
    {
      title: 'Posted By',
      dataIndex: 'postedBy',
      key: 'postedBy',
      sorter: true,
      sortOrder:
        selectedSorter &&
        selectedSorter.columnKey === 'postedBy' &&
        selectedSorter.order,
    },
    {
      title: 'Posted Date',
      dataIndex: 'postedDate',
      key: 'postedDate',
      sorter: true,
      sortOrder:
        selectedSorter &&
        selectedSorter.columnKey === 'postedDate' &&
        selectedSorter.order,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      width: 300,
      render: text => <div className="white-text fix-line">{text}</div>,
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

  useEffect(() => {
    getList(1);

    return () => {
      unmounted.current = true;
    };
  }, []);

  const getList = (page, search = '', filter = 1, sorter = null) => {
    let api = `api/admin/all-comments?page=${page}&search=${
      !!search && keyword.trim().length ? search : ''
    }&show_status=${
      filter === 1 ? 'all' : filter === 2 ? 'flagged' : 'deleted'
    }`;

    if (sorter) {
      api += `&order_by=${
        sorter.columnKey === 'postedDate'
          ? 'comment_created_at'
          : 'users.first_name'
      }&sort_by=${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
    }

    axiosInstance.get(api).then(res => {
      if (!unmounted.current) {
        setSelectedFilter(filter);
        const details = res.data.data;
        const newList = details.map(d => ({
          key: d.comment_id,
          feedId: [d.feed_id, d.comment_id],
          postedBy: `${d.first_name} ${d.last_name}`,
          postedDate: moment
            .utc(d.comment_created_at)
            .local()
            .format('DD/MM/yyyy HH:mm'),
          comment: d.comment,
          flagged: d.flag_created_at
            ? moment
                .utc(d.flag_created_at)
                .local()
                .format('DD/MM/yyyy HH:mm')
            : '-',
          deleted: d.comment_deleted_at
            ? moment
                .utc(d.comment_deleted_at)
                .local()
                .format('DD/MM/yyyy HH:mm')
            : '-',
        }));
        setCommentList(newList);

        setSelectedSorter(
          sorter
            ? {
                columnKey: sorter.columnKey,
                order: sorter.order,
              }
            : null,
        );

        setCustomPagination({
          ...customPagination,
          current: page,
          total: res.data.total,
        });
      }
    });
  };

  const handleTableChange = (pagination, filter, sorter) => {
    window.scrollTo(0, 0);
    getList(
      pagination.current,
      keyword,
      selectedFilter,
      sorter.column
        ? {
            columnKey: sorter.columnKey,
            order: sorter.order,
          }
        : null,
    );
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
          <Row>
            <SearchBar align="middle">
              <Input
                className="bodyBold white-text"
                placeholder="Search"
                style={{ width: '150px' }}
                value={keyword}
                addonBefore={
                  <Icon
                    onClick={() => {
                      getList(1, keyword, selectedFilter);
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
                  getList(1, keyword, selectedFilter);
                }}
                onChange={e => {
                  setKeyword(e.target.value);
                }}
              />
              {!!keyword && (
                <ClearIcon
                  onClick={() => {
                    setKeyword('');
                    getList(1, '', selectedFilter);
                  }}
                />
              )}
            </SearchBar>
            <FilterBar className="bodyBold">
              <div
                className={selectedFilter === 1 ? 'cyan-text' : 'white-text'}
                onClick={() => getList(1, keyword, 1, null)}
              >
                Show All
              </div>
              <div
                className={selectedFilter === 2 ? 'cyan-text' : 'white-text'}
                onClick={() => getList(1, keyword, 2, null)}
              >
                Show Flagged
              </div>
              <div
                className={selectedFilter === 3 ? 'cyan-text' : 'white-text'}
                onClick={() => getList(1, keyword, 3, null)}
              >
                Show Deleted
              </div>
            </FilterBar>
          </Row>
        }
      >
        <List
          className="bodyBold white-text"
          columns={columns}
          dataSource={commentList}
          sticky
          onChange={handleTableChange}
          pagination={customPagination}
          showSorterTooltip={false}
        />
      </AdminNavigationWrapperComponent>
    </div>
  );
}

CommentListPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  commentListPage: makeSelectCommentListPage(),
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
)(CommentListPage);
