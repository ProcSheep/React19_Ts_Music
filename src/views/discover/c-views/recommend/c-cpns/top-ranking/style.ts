import RecommendTopBg from "@/assets/img/recommend-top-bg.png"
import styled from "styled-components"

export const TopRankingWrapper = styled.div`
  .content {
    display: flex;
    margin-top: 20px;
    /* 宽高必须严格规定,因为背景是图片,它的大小固定 */
    height: 472px;
    width: 689px;
    background: url(${RecommendTopBg});
  }
`
