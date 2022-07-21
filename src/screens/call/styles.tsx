import styled from 'styled-components/native';

export const Container = styled.View<{ 'is-playing': boolean }>`
  padding: ${(props) => (props['is-playing'] ? 0 : 20)}px;
  flex: 1;
  position: relative;
  height: 100%;
  background-color: #ffffff;
`;
