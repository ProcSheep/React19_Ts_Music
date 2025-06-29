import styled from "styled-components"

export const HotAnchorWrapper = styled.div`
  padding: 20px;
  padding-left: 5px;

  .anchors {
    margin-top: 20px;

    .item {
      display: flex;
      margin-bottom: 10px;
      width: 210px;
      cursor: pointer;

      img {
        width: 40px;
        height: 40px;
      }

      .info {
        width: 160px;
        margin-left: 8px;
        .name {
          color: #000;
          font-weight: 700;
          margin-top: 3px;
        }

        .desc {
          color: #666;

          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
`
