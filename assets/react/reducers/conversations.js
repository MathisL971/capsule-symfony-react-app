import conversationService from "../services/conversation";
import messageService from "../services/message";

const initialState = {
  potentialConversation: null,
  activeConversation: null,
  activeConversationMessages: [],
  conversations: [],
  error: null,
};

const conversationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CONVERSATIONS_SUCCESS":
      return {
        ...state,
        conversations: action.payload,
        error: null,
      };
    case "CREATE_POTENTIAL_CONVERSATION":
      return {
        ...state,
        potentialConversation: action.payload,
        activeConversation: null,
        activeConversationMessages: [],
        error: null,
      };
    case "CREATE_CONVERSATION_SUCCESS":
      return {
        ...state,
        potentialConversation: null,
        activeConversation: action.payload,
        conversations: state.conversations.concat(action.payload),
        error: null,
      };
    case "CREATE_NEW_MESSAGE_SUCCESS":
      return {
        ...state,
        activeConversationMessages: state.activeConversationMessages.concat(
          action.payload
        ),
        error: null,
      };
    case "ABORT_POTENTIAL_CONVERSATION":
      return {
        ...state,
        potentialConversation: null,
      };
    case "ADD_CONVERSATION_RECEIVER":
      return {
        ...state,
        conversations: state.conversations.concat(action.payload),
      };
    case "UPDATE_CONVERSATION_SUCCESS":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
        error: null,
      };
    case "UPDATE_CONVERSATION_RECEIVER":
      return {
        ...state,
        conversations: state.conversations.map((c) => {
          return c.id === action.payload.id ? action.payload : c;
        }),
      };
    case "OPEN_CONVERSATION_MESSAGE_SUCCESS":
      return {
        ...state,
        activeConversationMessages: action.payload.activeConversationMessages,
        conversations: state.conversations.map((c) => {
          return c.id === action.payload.activeConversation.id
            ? action.payload.activeConversation
            : c;
        }),
        error: null,
      };
    case "UPDATE_RECEIVER_MESSAGES":
      return {
        ...state,
        activeConversationMessages: state.activeConversationMessages.concat(
          action.payload
        ),
      };
    case "UPDATE_NEW_MESSAGE_STATUS_SUCCESS":
      return {
        ...state,
        conversations: state.conversations.map((c) => {
          return c.id === action.payload.id ? action.payload : c;
        }),
      };
    case "MAKE_CONVERSATION_ACTIVE":
      return {
        ...state,
        activeConversation: action.payload,
        error: null,
      };
    case "MAKE_CONVERSATION_INACTIVE":
      return {
        ...state,
        potentialConversation: null,
        activeConversation: null,
        activeConversationMessages: [],
        error: null,
      };
    case "FAILURE":
      return {
        ...state,
        conversations: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const conversationFetchAction = (userId) => async (dispatch) => {
  try {
    const conversations = await conversationService.getAll();
    const userConversations = conversations["hydra:member"].filter((convo) => {
      return convo.idCreator === userId || convo.idCorrespondant === userId;
    });
    dispatch({
      type: "FETCH_CONVERSATIONS_SUCCESS",
      payload: userConversations,
    });
  } catch (e) {
    dispatch({ type: "FAILURE", payload: e.message });
  }
};

export const conversationAddAction = (newConversation) => async (dispatch) => {
  try {
    const createdConversation = await conversationService.create(
      newConversation
    );
    dispatch({
      type: "CREATE_CONVERSATION_SUCCESS",
      payload: createdConversation,
    });

    return createdConversation;
  } catch (e) {
    dispatch({ type: "FAILURE", payload: e.message });
  }
};

export const conversationAddMessageAction =
  (newMessage) => async (dispatch) => {
    try {
      console.log("Posting message to database");
      const addedMessage = await messageService.create(newMessage);
      console.log("Message object returned:", addedMessage);

      dispatch({
        type: "CREATE_NEW_MESSAGE_SUCCESS",
        payload: addedMessage,
      });

      return addedMessage;
    } catch (e) {
      dispatch({ type: "FAILURE", payload: e.message });
    }
  };

export const conversationUpdateAction =
  (updatedConversation) => async (dispatch) => {
    try {
      const returnedConversation = await conversationService.modifyConvo(
        updatedConversation
      );

      dispatch({
        type: "UPDATE_CONVERSATION_SUCCESS",
        payload: returnedConversation,
      });

      return returnedConversation;
    } catch (e) {
      dispatch({ type: "FAILURE", payload: e.message });
    }
  };

export const conversationOpenMessagesAction =
  (convo, user) => async (dispatch) => {
    try {
      const messages = await messageService.getAll();
      const conversationMessages = messages["hydra:member"].filter((m) => {
        return m.idConversation === convo.id;
      });

      const updatedConversation =
        user.id === convo.idCreator
          ? await conversationService.modifyConvo({
              ...convo,
              creatorHasNewMessage: false,
            })
          : await conversationService.modifyConvo({
              ...convo,
              correspondantHasNewMessage: false,
            });

      dispatch({
        type: "OPEN_CONVERSATION_MESSAGE_SUCCESS",
        payload: {
          activeConversation: updatedConversation,
          activeConversationMessages: conversationMessages,
        },
      });
    } catch (e) {
      dispatch({ type: "FAILURE", payload: e.message });
    }
  };

export const conversationUpdateNewMessageStatusAction =
  (updatedConvo) => async (dispatch) => {
    try {
      const returnedConvo = await conversationService.modifyConvo(updatedConvo);
      dispatch({
        type: "UPDATE_NEW_MESSAGE_STATUS_SUCCESS",
        payload: returnedConvo,
      });
    } catch (e) {
      dispatch({ type: "FAILURE", payload: e.message });
    }
  };

export default conversationsReducer;
