import React, { useEffect, useState } from "react";
import { Button, Navbar, Container, Nav } from "react-bootstrap";
import { useUser } from "../lib/hooks"


const Header = () => {
    const user = useUser()


    return (
        <Navbar className="p-2" collapseOnSelect expand="lg" bg="dark" variant="dark">

            <Navbar.Brand href="/"><img src="/automarker_logo_white.png" height={30} /></Navbar.Brand>
            <Button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </Button>
            <Navbar.Collapse className="navbar-collapse" id="navbarScroll">
                {user ? (
                    <Nav className="me-auto">
                        <Nav.Link className="user-nav" href="#">{user.name} {user.lastName}</Nav.Link>
                    </Nav>
                ) : (
                    <></>
                )}

                <Nav className="ml-auto">

                    {(() => {
                        if (user) {
                            if (user.role === "USER") {
                                return (
                                    <>
                                        <Nav.Link href="/user/profile" active>📓Profile</Nav.Link>
                                        <Nav.Link href="/user/courses" active>📚Courses</Nav.Link>
                                        <Nav.Link href="/api/logout" active>🚪Logout</Nav.Link>
                                    </>
                                );

                            } else if (user.role === "ADMIN") {
                                return (
                                    <>
                                        <Nav.Link href="/admin/profile" active>📓Dashboard</Nav.Link>
                                        <Nav.Link href="/admin/underConstruction" active>📚Courses</Nav.Link>
                                        <Nav.Link href="/admin/underConstruction" active>👨‍🏫Profs</Nav.Link>
                                        <Nav.Link href="/admin/underConstruction" active>🎓Users</Nav.Link>
                                        <Nav.Link href="/api/logout" active>🚪Logout</Nav.Link>
                                    </>
                                );

                            } else if (user.role === "PROF") {
                                return (
                                    <>
                                        <Nav.Link href="/prof/profile" active>📓Dashboard</Nav.Link>
                                        <Nav.Link href="/prof/tasks" active>✍️Tasks</Nav.Link>
                                        <Nav.Link href="#" active>🎓Students</Nav.Link>
                                        <Nav.Link href="/api/logout" active>🚪Logout</Nav.Link>
                                    </>

                                );
                            }
                        } else {
                            return (
                                <>
                                    <Nav.Link href="/" active>Home</Nav.Link>
                                    <Nav.Link href="/login" active>Login</Nav.Link>
                                </>
                            )
                        }
                    })()}

                </Nav>
            </Navbar.Collapse >

        </Navbar >
    )
}

export default Header
