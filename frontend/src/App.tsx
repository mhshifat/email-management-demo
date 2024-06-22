import { useEffect, useState } from "react"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [token, setToken] = useState("");
  const [emails, setEmails] = useState([]);
  const [marking, setMarking] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const uid = searchParams.get("uid");
    
    if (uid) {
      setIsLoggedIn(true);
      setToken(uid as string);
      localStorage.setItem("tid", uid);
      searchParams.delete("uid");
      window.history.pushState({}, "", `${window.location.origin}${window.location.pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`);
    }
  }, [])

  useEffect(() => {
    const uid = localStorage.getItem("tid");
    setToken(uid as string);
    if (uid) {
      setIsLoggedIn(true);
    }
  }, [])

  useEffect(() => {
    if (!token) return;
    fetchEmails();
  }, [token])

  useEffect(() => {
    let eventSource = new EventSource(`${import.meta.env.VITE_SERVER_URI}/api/v1/emails/google/sync/progress`);

    eventSource.onmessage = (event) => {
      const p = +(event?.data || "0");
      setCurrentProgress(p);
      if (p >= 100) {
        setIsSyncing(false);
        setCurrentProgress(0);
        if (token) {
          fetchEmails();
        }
      }
    } 

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    return () => {
      eventSource.close();
    }
  }, [token]);

  async function handleEmailSynching() {
    setIsSyncing(true);
    await fetch(`${import.meta.env.VITE_SERVER_URI}/api/v1/emails/google/sync?uid=${token}`);
  }

  async function fetchEmails() {
    const res = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/v1/emails/google?uid=${token}`);
    const { data } = await res.json();
    setEmails(data);
  }
  async function markAsRead(emailId: string) {
    setMarking(emailId);
    await fetch(`${import.meta.env.VITE_SERVER_URI}/api/v1/emails/google/${emailId}/mark-as-read?uid=${token}`, {
      method: "POST"
    });
    await fetchEmails();
    setMarking("");
  }
  return (
    <div>
      {isLoggedIn && <button onClick={() => {
        setIsLoggedIn(false);
        setToken("");
        localStorage.removeItem("tid");
      }}>Logout</button>}
      {!isLoggedIn && <a href={`${import.meta.env.VITE_SERVER_URI}/api/v1/auth/google`}><button>Login With Google</button></a>}
      {isLoggedIn && <button onClick={handleEmailSynching} disabled={isSyncing}>
        {isSyncing ? `Syncing... ( ${currentProgress}% )` : "Sync Emails"}
      </button>}
      {isLoggedIn && (
        <ul>
          {emails.map((email: any) => (
            <li key={email._id}>
              {!email?.isRead && <button onClick={() => markAsRead(email._id)}>
                {marking === email?._id ? "Marking...." : "Mark as read"}
                </button>}
              {email.subject} - {email.from}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
