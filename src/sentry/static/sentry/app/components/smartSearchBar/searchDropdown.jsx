import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styled from 'react-emotion';

import LoadingIndicator from 'app/components/loadingIndicator';
import space from 'app/styles/space';

class SearchDropdown extends React.PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    searchSubstring: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    searchSubstring: '',
    onClick: function() {},
  };

  renderDescription = item => {
    const searchSubstring = this.props.searchSubstring;
    if (!searchSubstring) {
      return item.desc;
    }

    const text = item.desc;

    if (!text) {
      return null;
    }

    const idx = text.toLowerCase().indexOf(searchSubstring.toLowerCase());

    if (idx === -1) {
      return item.desc;
    }

    return (
      <span>
        {text.substr(0, idx)}
        <strong>{text.substr(idx, searchSubstring.length)}</strong>
        {text.substr(idx + searchSubstring.length)}
      </span>
    );
  };

  renderHeaderItem = item => {
    return (
      <SearchDropdownGroup key={item.title}>
        <SearchDropdownGroupTitle>
          <GroupTitleIcon className={classNames('icon', item.icon)} />
          {item.title && item.title}
          <span>{this.renderDescription(item)}</span>
        </SearchDropdownGroupTitle>
      </SearchDropdownGroup>
    );
  };

  renderItem = item => (
    <SearchItem
      key={item.value || item.desc}
      className={item.active ? 'active' : null}
      data-test-id="search-autocomplete-item"
      onClick={this.props.onClick.bind(this, item.value, item)}
    >
      <SearchItemTitleWrapper>
        {item.title && item.title + ' · '}
        <span>{this.renderDescription(item)}</span>
      </SearchItemTitleWrapper>
      {item.example ? <SearchItemExample>{item.example}</SearchItemExample> : ''}
    </SearchItem>
  );

  render() {
    const {className, loading, items} = this.props;
    return (
      <StyledSearchDropdown className={className}>
        <div>
          {loading ? (
            <div key="loading" data-test-id="search-autocomplete-loading">
              <LoadingIndicator mini={true} />
            </div>
          ) : (
            <SearchItemsList>
              {items.map(item => {
                if (item.type === 'header') {
                  return this.renderHeaderItem(item);
                }

                return this.renderItem(item);
              })}
            </SearchItemsList>
          )}
        </div>
      </StyledSearchDropdown>
    );
  }
}

export default SearchDropdown;

const StyledSearchDropdown = styled('div')`
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
  border: 1px solid ${p => p.theme.borderLight};
  border-radius: 0 0 4px 4px;
  position: absolute;
  top: 37px;
  right: 0;
  left: 0;
  background: #fff;
  z-index: 100;
  overflow: hidden;
`;

const ListItem = styled('li')`
  border-bottom: 1px solid ${p => p.theme.borderLight};

  &:last-child {
    border-bottom: none;
  }
`;

const SearchDropdownGroup = styled(ListItem)``;

const GroupTitleIcon = styled('span')`
  margin-right: ${space(1)};
`;

const SearchDropdownGroupTitle = styled('h4')`
  display: flex;
  align-items: center;

  background-color: ${p => p.theme.offWhite};
  color: ${p => p.theme.gray2};
  font-weight: normal;
  font-size: ${p => p.theme.fontSizeMedium};

  margin: 0;
  padding: ${space(1)} ${space(2)};
`;

const SearchItemsList = styled('ul')`
  padding-left: 0;
  list-style: none;
  margin-bottom: 0;
`;

const SearchItem = styled(ListItem)`
  font-size: ${p => p.theme.fontSizeLarge};
  padding: ${space(1)} ${space(2)};
  cursor: pointer;

  &:hover,
  &.active {
    background: ${p => p.theme.offWhite};
  }
`;

const SearchItemTitleWrapper = styled('h5')`
  font-weight: normal;
  font-size: ${p => p.theme.fontSizeMedium};
  margin: 0;
`;

const SearchItemExample = styled('div')`
  font-size: ${p => p.theme.fontSizeSmall};
  font-family: ${p => p.theme.familyMono};
`;
