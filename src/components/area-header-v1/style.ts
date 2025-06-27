import styled from "styled-components"

export const AreaHeaderV1Wrapper = styled.div`
  height: 33px;
  border-bottom: 2px solid #c10d0c;
  padding: 0 10px 4px 34px;
  background-position: -225px -156px; /* sprite_02精灵图定位 */

  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;
    align-items: center;

    .title {
      font-size: 20px;
      font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
      margin-right: 20px;
    }

    .keywords {
      display: flex;
      align-items: center;

      .item {
        position: relative;
        top: 2px;

        .link {
          &:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }

        .divider {
          margin: 0 15px;
          color: #ccc;
        }

        /* 最后一个分隔符不显示 */
        &:last-child {
          .divider {
            display: none;
          }
        }
      }
    }
  }

  .right {
    display: flex;
    align-items: center;

    .more {
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .icon {
      display: inline-block; /* 不独占一行的块级元素 */
      width: 12px;
      height: 12px;
      margin-left: 4px;
      background-position: 0 -240px; /* sprite_02精灵图定位 */
    }
  }
`
