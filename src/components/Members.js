import { Container } from "@mui/material";
import { Element } from 'react-scroll';

export default function Members() {
  return (
    <Element id="membersSection" className="members">
      <Container>
        <div className="section-title" id="members">
          <h1>Team Members</h1>
        </div>
        <div className="members-content">
          <div className="member-item">
            {/* eslint-disable-next-line */}
            <img
              src="./wall.svg"
              data-nsfw-filter-status
              alt=""
              className="mask-wall"
            />
            {/* eslint-disable-next-line */}
            <img
              src="./dragon-1-210x210.png"
              alt=""
              data-nsfw-filter-status
              className="member-dragon"
            />
            <h3>Keekaz</h3>
            <h5>Project Leader</h5>
          </div>
          <div className="member-item">
            {/* eslint-disable-next-line */}
            <img
              src="./wall.svg"
              data-nsfw-filter-status
              alt=""
              className="mask-wall"
            />
            {/* eslint-disable-next-line */}
            <img
              src="./dragon-2-210x210.png"
              alt=""
              data-nsfw-filter-status
              className="member-dragon"
            />
            <h3>Dragon6</h3>
            <h5>Project Manager</h5>
          </div>
          <div className="member-item">
            {/* eslint-disable-next-line */}
            <img
              src="./wall.svg"
              data-nsfw-filter-status
              alt=""
              className="mask-wall"
            />
            {/* eslint-disable-next-line */}
            <img
              src="./dragon-3-210x210.png"
              alt=""
              data-nsfw-filter-status
              className="member-dragon"
            />
            <h3>Purely Goated</h3>
            <h5>Marketer</h5>
          </div>
          <div className="member-item">
            {/* eslint-disable-next-line */}
            <img
              src="./wall.svg"
              data-nsfw-filter-status
              alt=""
              className="mask-wall"
            />
            {/* eslint-disable-next-line */}
            <img
              src="./dragon-4-210x210.png"
              alt=""
              data-nsfw-filter-status
              className="member-dragon"
            />
            <h3>Trexagon</h3>
            <h5>Founder & Artist</h5>
          </div>
          <div className="member-item">
            {/* eslint-disable-next-line */}
            <img
              src="./wall.svg"
              data-nsfw-filter-status
              alt=""
              className="mask-wall"
            />
            {/* eslint-disable-next-line */}
            <img
              src="./dragon-5-210x210.png"
              alt=""
              data-nsfw-filter-status
              className="member-dragon"
            />
            <h3>awmill20</h3>
            <h5>Marketer</h5>
          </div>
        </div>
      </Container>
    </Element >
  )
}
