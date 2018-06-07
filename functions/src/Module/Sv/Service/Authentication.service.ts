import { DocumentSnapshot } from "@google-cloud/firestore";

export const AuthenService = {
    token: '',
    serviceSnap: null,
    setServiceSnap: function(snap : DocumentSnapshot)   {
        AuthenService.serviceSnap = snap;
    },
    getServiceSnap: function() : DocumentSnapshot  {
        return AuthenService.serviceSnap
    }
}