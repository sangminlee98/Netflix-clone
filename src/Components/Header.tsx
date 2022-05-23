import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: red;
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled.svg`
  margin-right: 50px;
`;
const Items = styled.ul`
  display: flex;
  align-items: center;
`;
const Item = styled.li`
  margin-right: 20px;
`;

const Header = () => {
  return (
    <Nav>
      <Col>
        <Logo/>
        <Items>
          <Item>Home</Item>
          <Item>TV Shows</Item>
          <Item></Item>
          <Item></Item>
          <Item></Item>
        </Items>
      </Col>
      <Col>

      </Col>
    </Nav>
  );
};

export default Header;