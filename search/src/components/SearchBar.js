import React from 'react'
import Downshift from 'downshift'

import Search from '../icons/Search'

const items = ['apple', 'pear', 'orange', 'grape', 'banana']

const styles = {
  SearchBar: {
    position: 'absolute',
    top: '50%',
    width: 480,
    height: 56,
    left: '50%',
    marginLeft: -240,
    marginTop: -56,
    borderBottom: '2px solid #747474'
  },
  input: {
    width: 384,
    height: 32,
    fontSize: 28,
    border: 0,
    outline: 0,
    float: 'left',
    color: '#747474'
  },
  icon: {
    width: 42,
    height: 42,
    float: 'right',
    color: '#747474',
    cursor: 'pointer'
  },
  downshift: {
    marginTop: 58,
    textAlign: 'left',
    cursor: 'pointer',
    lineHeight: '32px',
    boxShadow: 'grey 3px 5px 9px 2px'
  },
  downshiftRow: {
    fontSize: 20
  }
}

export default function SearchBar (props) {
  return (
    <Downshift
      render={({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem
      }) => (
        <div style={styles.SearchBar}>
          <div>
            <input {...getInputProps()} style={styles.input} placeholder='What are you looking for?' />
            <Search style={styles.icon} />
          </div>

          {isOpen &&
            <div style={styles.downshift}>
              {items
                .filter(i => !inputValue || i.includes(inputValue))
                .map((item, index) => (
                  <div
                    {...getItemProps({
                      key: item,
                      index,
                      item,
                      style: Object.assign({}, styles.downshiftRow, {
                        backgroundColor:
                          highlightedIndex === index ? 'lightgray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal'
                      })
                    })}
                  >
                    {item}
                  </div>
                ))}
            </div>
          }
        </div>
      )}
    />
  )
}