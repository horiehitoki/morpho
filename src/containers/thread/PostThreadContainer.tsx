"use client";

import useAgent from "@/lib/hooks/bsky/useAgent";
import { getPostThread } from "@/lib/api/bsky/feed";
import { useQuery } from "@tanstack/react-query";
import { AppBskyFeedDefs } from "@atproto/api";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import useOrganizeThread from "@/lib/hooks/bsky/feed/useOrganizeThread";
import FeedPost from "@/components/contentDisplay/feedPost/FeedPost";
import usePreferences from "@/lib/hooks/bsky/actor/usePreferences";
import ThreadPost from "@/components/contentDisplay/threadPost/ThreadPost";
import BlockedEmbed from "@/components/dataDisplay/postEmbed/BlockedEmbed";
import NotFoundEmbed from "@/components/dataDisplay/postEmbed/NotFoundEmbed";
import Button from "@/components/actions/button/Button";
import { useRouter } from "next/navigation";
import FeedPostSkeleton from "@/components/contentDisplay/feedPost/FeedPostSkeleton";
import FeedAlert from "@/components/feedback/feedAlert/FeedAlert";
import RepliesContainer from "./RepliesContainer";
import ParentContainer from "./ParentContainer";

interface Props {
  id: string;
  handle: string;
}

export default function PostThreadContainer(props: Props) {
  const { id, handle } = props;
  const agent = useAgent();
  const router = useRouter();

  const {
    data: thread,
    error,
    isError,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["postThread", id],
    queryFn: async () => {
      const { data } = await agent.resolveHandle({ handle });
      if (!data) return;
      const uri = `at://${data.did}/app.bsky.feed.post/${id}`;
      return getPostThread(agent, uri);
    },
  });

  const { replyChains, parentChain } = useOrganizeThread({
    thread: thread,
  });

  const { preferences } = usePreferences();
  const contentFilter = preferences?.contentFilter;
  const threadPreferences = preferences?.threadPreferences;

  if (
    AppBskyFeedDefs.isBlockedPost(thread) ||
    AppBskyFeedDefs.isNotFoundPost(thread) ||
    AppBskyFeedDefs.isBlockedAuthor(thread) ||
    isError
  ) {
    return (
      <>
        <div className="md:border  md:border-x md:rounded-t-2xl">
          <h2 className="text-xl text-center font-semibold px-3 py-2">Post</h2>
        </div>
        <section className="border border-t-0 md:rounded-b-2xl p-3">
          {AppBskyFeedDefs.isBlockedPost(thread) && <BlockedEmbed depth={0} />}
          {AppBskyFeedDefs.isNotFoundPost(thread) && (
            <NotFoundEmbed depth={0} />
          )}
          {AppBskyFeedDefs.isBlockedAuthor(thread) && (
            <BlockedEmbed depth={0} />
          )}
          {isError && (
            <FeedAlert
              variant="badResponse"
              message={error.message}
              standalone={true}
            />
          )}
          <div className="flex justify-center mt-3">
            <Button onClick={() => router.push("/dashboard/home")}>
              Go Home
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="md:border md:border-b-0 border-b-0 md:border-x md:rounded-t-2xl">
        <h2 className="text-xl text-center font-semibold px-3 py-2">Post</h2>
      </div>

      {(isFetching || isLoading) && <FeedPostSkeleton />}

      {parentChain && parentChain.length > 0 && contentFilter && (
        <ParentContainer
          parentChain={parentChain}
          contentFilter={contentFilter}
        />
      )}

      {thread && contentFilter && (
        <ThreadPost post={thread?.post as PostView} filter={contentFilter} />
      )}

      {contentFilter && threadPreferences && replyChains && (
        <RepliesContainer
          replies={replyChains}
          threadPreferences={threadPreferences}
          contentFilter={contentFilter}
        />
      )}
    </>
  );
}
