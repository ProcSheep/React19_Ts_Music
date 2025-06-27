import WrapBg from "@/assets/img/wrap-bg.png"
import styled from "styled-components"

export const RecommendWrapper = styled.div`
  > .content {
    border: 1px solid #d3d3d3;
    background-image: url(${WrapBg});
    display: flex;

    > .left {
      padding: 20px;
      width: 729px;
    }

    > .right {
      margin-left: 1px; /* 空余1px显示背景图片的边框 */
      width: 250px;
    }
  }
`
