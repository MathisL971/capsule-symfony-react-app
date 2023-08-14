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
        activeConversation: action.payload,
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
    case "ABORT_POTENTIAL_CONVERSATION_AND_SWITCH":
      return {
        ...state,
        potentialConversation: null,
        activeConversation: action.payload.newConversation,
        activeConversationMessages: state.activeConversationMessages.concat(
          action.payload.newMessage
        ),
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
          c.id_convo === action.payload.id_convo ? action.payload : c
        ),
        error: null,
      };
    case "UPDATE_CONVERSATION_RECEIVER":
      return {
        ...state,
        conversations: state.conversations.map((c) => {
          return c.id_convo === action.payload.id_convo ? action.payload : c;
        }),
      };
    case "OPEN_CONVERSATION_MESSAGE_SUCCESS":
      return {
        ...state,
        potentialConversation: null,
        activeConversation: action.payload.activeConversation,
        activeConversationMessages: action.payload.activeConversationMessages,
        conversations: state.conversations.map((c) => {
          return c.id_convo === action.payload.activeConversation.id_convo
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
          return c.id_convo === action.payload.id_convo ? action.payload : c;
        }),
      };
    case "MAKE_CONVERSATION_ACTIVE":
      return {
        ...state,
        activeConversation: action.payload,
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
    const conversations = await conversationService.getUserConvos(userId);
    dispatch({ type: "FETCH_CONVERSATIONS_SUCCESS", payload: conversations });
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
  } catch (e) {
    dispatch({ type: "FAILURE", payload: e.message });
  }
};

export const conversationAddMessageAction =
  (newMessage) => async (dispatch) => {
    try {
      const addedMessage = await messageService.create(newMessage);

      dispatch({
        type: "CREATE_NEW_MESSAGE_SUCCESS",
        payload: addedMessage,
      });
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
    } catch (e) {
      dispatch({ type: "FAILURE", payload: e.message });
    }
  };

export const conversationOpenMessagesAction =
  (convo, user) => async (dispatch) => {
    try {
      const conversationMessages = await messageService.getConvoMessages(
        convo.id_convo
      );

      let updatedConversation;
      if (user.id === convo.id_creator) {
        updatedConversation = await conversationService.modifyConvo({
          ...convo,
          date_last_seen_creator: new Date().toISOString(),
          creatorHasNewMessage: false,
        });
      } else {
        updatedConversation = await conversationService.modifyConvo({
          ...convo,
          date_last_seen_correspondant: new Date().toISOString(),
          correspondantHasNewMessage: false,
        });
      }

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
