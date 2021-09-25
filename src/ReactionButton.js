import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
    padding: 5px 10px;
`

const ReactionToggleButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    height: 32px;
`;

const ReactionToggleButton = styled.button`
    height: 32px;
    width: 32px;
    background: #edeef0;
    border: 1px solid #ffffff;
    border-radius: 100px;
    padding: 2px 8px;
    cursor: pointer;
    box-sizing: border-box;
    border-radius: 100px;

    &:hover {
        background: #bababc;
    }

    & > div {
        display: flex;
        justify-content: center;
    }
`;

const ReactionPreview = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2px 8px;
    position: relative;
    width: 54px;
    height: 32px;
    background: #f4f4f4;
    border: 1px solid #ffffff;
    box-sizing: border-box;
    border-radius: 100px;

    ${({ active }) =>
        active &&
        `
        border: 1px solid #0F62FE;
        background: #EDF5FF;
    `}

    &>span {
        font-family: IBM Plex Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
    }
`;

const ReactionPreviewItem = ({ lastReaction, value }) => (
    <ReactionPreview active={lastReaction.reaction_id === value.id}>
        <span>{value.emoji}</span>
        <span>&#183;</span>
        <span>{value.count}</span>
    </ReactionPreview>
);

export default function ReactionsComponent({reactionsData, userData, contentId, userReactionData, setUserReactions}) {

    const [popupLeft, setPopupLeft] = useState(0);
    const [showReactions, setShowReactions] = useState(false);
    const [lastReaction, setLastReaction] = useState({});
    const [reactionHistory, setReactionHistory] = useState(userReactionData);
    const [contentUserReactions, setContentUserReactions] = useState(() => {
		return userReactionData.filter((react) => {
			return react.content_id === contentId
		})
	});

    function reactionToggle(event) {
        let itemLeft = event.target.offsetLeft
        let itemWidth = event.target.offsetWidth / 2

        setPopupLeft(itemLeft + itemWidth - 10)
        setShowReactions(!showReactions)
    }

    function clickReaction(reactData) {
        const reactionHistoryHasReaction = reactionHistory.find(
            (reaction) => reaction.reaction_id === reactData.id && reaction.user_id === userData.id
        )

        let newReactionHistory = reactionHistory
        if (reactionHistoryHasReaction) {
            let reactionIndex = reactionHistory.findIndex((reaction) => reaction.reaction_id === reactData.id && reaction.user_id === userData.id)
            newReactionHistory.splice(reactionIndex, 1)

            setReactionHistory(newReactionHistory)
            setContentUserReactions(() => {
                return userReactionData.filter((react) => {
                    return react.content_id === contentId
                })
            })
            setShowReactions(false)

            axios.delete("https://artful-iudex.herokuapp.com/user_content_reactions", newReactionHistory).then((res) => {
                console.log(res.data);
                setUserReactions(res.data)
            })

        } else {
            const newReaction = {
                "id": userReactionData.length + 1,
                "user_id": userData.id,
                "reaction_id": reactData.id,
                "content_id": contentId
            }
            newReactionHistory.push(newReaction)
            setLastReaction(newReaction)
            setReactionHistory(newReactionHistory)
            setContentUserReactions(() => {
                return userReactionData.filter((react) => {
                    return react.content_id === contentId
                })
            })
            setShowReactions(false)

            axios.post("https://artful-iudex.herokuapp.com/user_content_reactions", newReaction).then((res) => {
                console.log(res.data);
                setUserReactions(res.data)
            })
        }

    }

    const reactionPreviews = {}
    Object.entries(contentUserReactions).forEach(([key, value]) => {
        if (reactionPreviews.hasOwnProperty(value.reaction_id)) {
            reactionPreviews[value.reaction_id] = {
                id: value.reaction_id,
                emoji: reactionsData[value.reaction_id - 1]["emoji"],
                name: reactionsData[value.reaction_id - 1]["name"],
                count: reactionPreviews[value.reaction_id]["count"] + 1,
            }
        } else {
            reactionPreviews[value.reaction_id] = {
                id: value.reaction_id,
                emoji: reactionsData[value.reaction_id - 1]["emoji"],
                name: reactionsData[value.reaction_id - 1]["name"],
                count: 1,
            }
        }
    })

    return (
        <Container>
            <ReactionToggleButtonContainer>
                {Object.entries(reactionPreviews).map(([key, value]) => {
                    return (
                        <ReactionPreviewItem
                            key={key}
                            value={value}
                            lastReaction={lastReaction}
                        />
                    );
                })}
                <ReactionToggleButton onClick={(e) => reactionToggle(e)}>
                    <div>
                        <img
                            alt="face-icon"
                            src={"./icons/face-icon.svg"}
                            width="15"
                            height="15"
                        />
                    </div>
                </ReactionToggleButton>
            </ReactionToggleButtonContainer>

            {showReactions && (
                <ReactionButtonsComponent
                    reactionList={reactionsData}
                    clickReaction={clickReaction}
                    popupLeft={popupLeft}
                />
            )}
        </Container>
    );
}

const ReactionButtonsContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 16px;
    padding: 0px 20px;
    height: 32px;
    border-radius: 24px;
    border: 1px solid #e0e0e0;
    box-shadow: 0px 4px 4px 0px #00000008;
    transform: translate(calc(-50% + var(--left)) ,-200%);
`;

const ReactionNamePopup = styled.span`
    border-radius: 2px;
    background: #161616;
    padding: 12px 16px;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 15px;
    font-family: IBM Plex Sans;
    font-weight: 400;
    letter-spacing: 0.4px;
    color: #fff;
    font-weight: bold;
    opacity: 0;
    transition: opacity 50ms ease;
    left: 50%;
    position: absolute;
    top: -27px;
    transform: scale(0.5) translateX(-100%);

    &:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #161616 transparent transparent transparent;
    }
`;

function ReactionButtonsComponent({
    reactionList,
    clickReaction,
    popupLeft,
}) {
    return (
        <ReactionButtonsContainer style={{"--left": `${popupLeft}px`}}>
            {reactionList.map((value, key) => (
                <Reactions
                    key={key}
                    reactionData={value}
                    clickFunction={clickReaction}
                />

            ))}
        </ReactionButtonsContainer>
    );
}

const ReactionButton = styled.button`
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    font-family: IBM Plex Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.0016em;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    position: relative;
    cursor: pointer;
    padding: 0px;

    &:hover {
        transition: all 0.2s ease-in;
        transform: scale(2);
        transform-origin: 50% 100%;
    }

    &:hover > ${ReactionNamePopup} {
        opacity: 1;
    }

    & > div {
        font-size: 16px;
    }
`;

const Reactions = ({ reactionData, clickFunction }) => (
    <ReactionButton onClick={() => clickFunction(reactionData)}>
        <ReactionNamePopup>{reactionData.name}</ReactionNamePopup>
        <div> {reactionData.emoji}</div>
    </ReactionButton>
);
