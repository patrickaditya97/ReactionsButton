import React, { useState } from 'react';
import styled from 'styled-components';
import ReactionsComponent from './ReactionButton';

const AppContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
    justify-content: center;
`

const Container = styled.div`
    position: absolute;
	height: 100%;
	margin: 20px 0px;
	display: flex;
    flex-direction: column;
    gap: 40px;
`

const PostsContainer = styled.div`
    height: 200px;
    width: 500px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 35px;
`

const UserDescriptionContainer = styled.div`
	display: flex;
	align-items: flex-start;
	flex-direction: row;
	gap:10px;
	&>p {
		margin: 0px;
	}
`

function App({usersData, reactionsData, userReactionData}) {
	const [userData] = useState(usersData);
    const [reactions] = useState(reactionsData);
    const [userReactions, setUserReactions] = useState(userReactionData);
	const [contentIds] = useState([1, 2])

	return (
		<AppContainer>
			<Container>
				{Object.entries(userData).map(([key, value]) => {
					return contentIds.map((contentId, index) => {
						return (
							<Posts 
								key={`${key}-${contentId}`}
								reactionsData={reactions} 
								userData={value}
								contentId={contentId}
								userReactionData={userReactions}
								userReactionDataSize={userReactions.length}
								setUserReactions={setUserReactions}
							/>
						)
					});
				})}
			</Container>
		</AppContainer>
    );
}

const Posts = ({userData, reactionsData, contentId, userReactionData, userReactionDataSize, setUserReactions}) => (
	<PostsContainer>
		<UserDescriptionContainer>
			<img alt={"user img"} src={userData.avatar} width = {32} height={32}/>
			<p>{`${userData.first_name} ${userData.last_name}: ${contentId}`}</p>
		</UserDescriptionContainer>

		<ReactionsComponent 
			userData = {userData}
			reactionsData={reactionsData}
			contentId={contentId}
			userReactionData={userReactionData}
			userReactionDataSize={userReactionDataSize}
			setUserReactions={setUserReactions}
		/>
	</PostsContainer>
)

export default App;
