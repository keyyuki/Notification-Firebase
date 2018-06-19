import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

export const AuthenService = {
    token: '',
    serviceSnap: null,
    setServiceSnap: function(snap : DocumentSnapshot)   {
        AuthenService.serviceSnap = snap;
    },
    getServiceSnap: function() : DocumentSnapshot  {
        return AuthenService.serviceSnap
    },
    getServiceId : function() : String {
        return AuthenService.serviceSnap ? AuthenService.serviceSnap.id : null;
    }
}