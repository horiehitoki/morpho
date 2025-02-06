import { type Agent, AppBskyActorDefs } from "@atproto/api";
import { getAgentFromServer } from "../agent";
import { SavedFeed } from "../../../../../types/feed";

export const getPopularFeeds = async (search?: string, agent?: Agent) => {
  if (!agent) agent = await getAgentFromServer();
  const popularFeeds = await agent.app.bsky.unspecced.getPopularFeedGenerators({
    query: search,
  });

  if (!popularFeeds.success) {
    throw new Error("Couldn't get popular feeds");
  }

  return popularFeeds.data.feeds;
};

export const getSavedFeeds = async (agent?: Agent): Promise<SavedFeed[]> => {
  if (!agent) agent = await getAgentFromServer();
  const prefs = await agent.app.bsky.actor.getPreferences();
  if (!prefs.success) throw new Error("Could not fetch feeds");

  const feedsPref = prefs.data.preferences.find(
    (pref) =>
      AppBskyActorDefs.isSavedFeedsPref(pref) &&
      AppBskyActorDefs.validateSavedFeedsPref(pref).success,
  ) as AppBskyActorDefs.SavedFeedsPref | undefined;

  if (!feedsPref || feedsPref.saved.length === 0) return [];

  const generators = await agent.app.bsky.feed.getFeedGenerators({
    feeds: feedsPref.saved,
  });
  if (!generators.success) {
    throw new Error("Could not fetch feed generators");
  }

  return generators.data.feeds.map((feed) => ({
    ...feed,
    pinned: feedsPref.pinned.includes(feed.uri),
  }));
};

export const togglePinFeed = async (agent: Agent, feed: string) => {
  const prefs = await agent.app.bsky.actor.getPreferences();
  if (!prefs.success) throw new Error("Could not fetch feeds");

  for (const pref of prefs.data.preferences) {
    if (
      AppBskyActorDefs.isSavedFeedsPref(pref) &&
      AppBskyActorDefs.validateSavedFeedsPref(pref).success
    ) {
      if (pref.pinned.includes(feed)) {
        pref.pinned = pref.pinned.filter((f) => f !== feed);
      } else {
        pref.pinned.push(feed);
      }
    }
  }

  return await agent.app.bsky.actor.putPreferences({
    preferences: prefs.data.preferences,
  });
};

export const toggleSaveFeed = async (agent: Agent, feed: string) => {
  const prefs = await agent.app.bsky.actor.getPreferences();
  if (!prefs.success) throw new Error("Could not fetch feeds");

  for (const pref of prefs.data.preferences) {
    if (
      AppBskyActorDefs.isSavedFeedsPref(pref) &&
      AppBskyActorDefs.validateSavedFeedsPref(pref).success
    ) {
      if (pref.saved.includes(feed)) {
        pref.pinned = pref.pinned.filter((f) => f !== feed);
        pref.saved = pref.saved.filter((f) => f !== feed);
      } else {
        pref.saved.push(feed);
      }
    }
  }

  return await agent.app.bsky.actor.putPreferences({
    preferences: prefs.data.preferences,
  });
};

export const starFeed = async (agent: Agent, uri: string, cid: string) => {
  const star = await agent.like(uri, cid);
  return star;
};

export const unstarFeed = async (agent: Agent, starUri: string) => {
  await agent.deleteLike(starUri);
};

export const getTimeline = async (agent: Agent, cursor?: string) => {
  const timeline = await agent.getTimeline({ cursor: cursor });
  return timeline;
};

export const getFeed = async (agent: Agent, uri: string, cursor: string) => {
  const feed = await agent.app.bsky.feed.getFeed({ feed: uri, cursor: cursor });
  return feed;
};

export const getFeedInfo = async (uri: string, agent?: Agent) => {
  if (!agent) agent = await getAgentFromServer();
  const feed = await agent.app.bsky.feed.getFeedGenerator({ feed: uri });
  if (!feed.success) throw new Error("Could not fetch feed info");
  return feed.data;
};

export const getUserPosts = async (
  agent: Agent,
  handle: string,
  cursor: string,
) => {
  const posts = await agent.getAuthorFeed({
    actor: handle,
    cursor: cursor,
    filter: "posts_no_replies",
    includePins: true,
  });

  if (!posts.success) throw new Error("Could not fetch posts");
  return posts;
};

export const getUserReplyPosts = async (
  agent: Agent,
  handle: string,
  cursor: string,
) => {
  const posts = await agent.getAuthorFeed({
    actor: handle,
    filter: "posts_with_replies",
    cursor: cursor,
  });

  if (!posts.success) throw new Error("Could not fetch replies");
  return posts;
};

export const getUserMediaPosts = async (
  agent: Agent,
  handle: string,
  cursor: string,
) => {
  const posts = await agent.getAuthorFeed({
    actor: handle,
    filter: "posts_with_media",
    cursor: cursor,
  });

  if (!posts.success) throw new Error("Could not fetch media posts");
  return posts;
};

export const getUserStars = async (
  agent: Agent,
  handle: string,
  cursor: string,
) => {
  if (!agent) agent = await getAgentFromServer();
  const stars = await agent.app.bsky.feed.getActorLikes({
    actor: handle,
    cursor: cursor,
  });

  if (!stars.success) throw new Error("Could not fetch stars");
  return stars;
};

export const starPost = async (agent: Agent, uri: string, cid: string) => {
  try {
    const star = await agent.like(uri, cid);
    return star;
  } catch (e) {
    throw new Error("Could not star post");
  }
};

export const unstarPost = async (agent: Agent, starUri: string) => {
  try {
    const unstar = await agent.deleteLike(starUri);
    return unstar;
  } catch (e) {
    throw new Error("Could not unstar post");
  }
};

export const repost = async (agent: Agent, uri: string, cid: string) => {
  try {
    const star = await agent.repost(uri, cid);
    return star;
  } catch (e) {
    throw new Error("Could not repost");
  }
};

export const unRepost = async (agent: Agent, repostUri: string) => {
  try {
    const unstar = await agent.deleteRepost(repostUri);
    return unstar;
  } catch (e) {
    throw new Error("Could not delete repost");
  }
};

export const removePost = async (agent: Agent, uri: string) => {
  try {
    const post = await agent.deletePost(uri);
    return post;
  } catch (e) {
    throw new Error("Could not delete post");
  }
};

export const getPost = async (agent: Agent, uri: string) => {
  try {
    const post = await agent.getPostThread({ uri: uri, depth: 1 });
    if (!post.success) throw new Error("Could not fetch post");
    return post;
  } catch (e) {
    throw new Error("Could not fetch post");
  }
};

export const getPostThread = async (uri: string, agent?: Agent) => {
  if (!agent) agent = await getAgentFromServer();

  try {
    const posts = await agent.getPostThread({ uri: uri });
    return posts.data.thread;
  } catch (e) {
    throw e;
  }
};

export const getPostStars = async (
  agent: Agent,
  uri: string,
  cursor: string,
) => {
  try {
    const stars = await agent.getLikes({ uri: uri, cursor: cursor, limit: 50 });
    return stars.data;
  } catch (e) {
    throw new Error("Could not fetch post stars");
  }
};

export const getPostReposts = async (
  agent: Agent,
  uri: string,
  cursor: string,
) => {
  try {
    const stars = await agent.getRepostedBy({
      uri: uri,
      cursor: cursor,
      limit: 50,
    });
    return stars.data;
  } catch (e) {
    throw new Error("Could not fetch post reposts");
  }
};

export const getPostQuotes = async (
  agent: Agent,
  uri: string,
  cursor: string,
) => {
  try {
    const quotes = await agent.app.bsky.feed.getQuotes({
      uri: uri,
      cursor: cursor,
      limit: 50,
    });
    return quotes.data;
  } catch (e) {
    throw new Error("Could not fetch post quotes");
  }
};
